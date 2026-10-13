# backend/eligibility_engine.py
from typing import Dict, Any, List, Tuple
from schemas import EligibilityProfile, SchemeMatchResult, CriteriaEvaluation

def evaluate_scheme_eligibility(scheme: Dict[str, Any], profile: EligibilityProfile) -> SchemeMatchResult:
    lang = profile.language if profile.language in ["en", "hi", "mr"] else "en"
    rules = scheme.get("eligibility_criteria", {})
    
    matched_reasons = []
    unmet_reasons = []
    info_needed = []
    criteria_evals: List[CriteriaEvaluation] = []
    
    score = 100
    hard_disqualification = False
    
    # 1. State check
    app_states = rules.get("applicable_states", ["All India"])
    if "All India" in app_states:
        matched_reasons.append(
            get_localized_text(
                en="Applicable nationwide across all States and Union Territories",
                hi="पूरे देश में सभी राज्यों और केंद्र शासित प्रदेशों में लागू",
                mr="संपूर्ण देशभरात सर्व राज्ये व केंद्रशासित प्रदेशांमध्ये लागू",
                lang=lang
            )
        )
        criteria_evals.append(CriteriaEvaluation(
            criteria_name="Jurisdiction / State",
            status="matched",
            message=f"All India ({profile.state})"
        ))
    else:
        # State specific
        if profile.state in app_states:
            matched_reasons.append(
                get_localized_text(
                    en=f"Matches your state: {profile.state}",
                    hi=f"आपके राज्य के अनुकूल: {profile.state}",
                    mr=f"तुमच्या राज्यासाठी लागू: {profile.state}",
                    lang=lang
                )
            )
            criteria_evals.append(CriteriaEvaluation(
                criteria_name="Jurisdiction / State",
                status="matched",
                message=f"State Specific ({profile.state})"
            ))
        else:
            hard_disqualification = True
            score -= 60
            unmet_reasons.append(
                get_localized_text(
                    en=f"Scheme is strictly restricted to residents of {', '.join(app_states)}. You selected {profile.state}.",
                    hi=f"यह योजना केवल {', '.join(app_states)} के निवासियों के लिए है। आपने {profile.state} चुना है।",
                    mr=f"ही योजना केवळ {', '.join(app_states)} येथील रहिवाशांसाठी आहे. तुम्ही {profile.state} निवडले आहे.",
                    lang=lang
                )
            )
            criteria_evals.append(CriteriaEvaluation(
                criteria_name="Jurisdiction / State",
                status="unmet",
                message=f"Restricted to {', '.join(app_states)}"
            ))

    # 2. Gender check
    req_gender = rules.get("gender", "all")
    if req_gender != "all":
        if profile.gender.lower() == req_gender.lower():
            matched_reasons.append(
                get_localized_text(
                    en=f"Matches gender criteria: reserved for {req_gender}",
                    hi=f"लिंग पात्रता पूर्ण: {req_gender} के लिए विशेष",
                    mr=f"लिंग निकष पूर्ण: {req_gender} साठी राखीव",
                    lang=lang
                )
            )
            criteria_evals.append(CriteriaEvaluation(
                criteria_name="Gender",
                status="matched",
                message=f"Matches ({req_gender})"
            ))
        else:
            hard_disqualification = True
            score -= 50
            unmet_reasons.append(
                get_localized_text(
                    en=f"Scheme is exclusively for {req_gender} applicants. Selected gender is {profile.gender}.",
                    hi=f"यह योजना विशेष रूप से {req_gender} आवेदकों के लिए है। चुना गया लिंग {profile.gender} है।",
                    mr=f"ही योजना केवळ {req_gender} अर्जदारांसाठी आहे. निवडलेले लिंग {profile.gender} आहे.",
                    lang=lang
                )
            )
            criteria_evals.append(CriteriaEvaluation(
                criteria_name="Gender",
                status="unmet",
                message=f"Requires {req_gender}"
            ))
    else:
        criteria_evals.append(CriteriaEvaluation(
            criteria_name="Gender",
            status="matched",
            message="Open to all genders"
        ))

    # 3. Age check
    min_age = rules.get("min_age", 0)
    max_age = rules.get("max_age", 120)
    if min_age <= profile.age <= max_age:
        matched_reasons.append(
            get_localized_text(
                en=f"Age {profile.age} is within eligible bracket ({min_age} to {max_age} years)",
                hi=f"आयु {profile.age} वर्ष पात्र श्रेणी ({min_age} से {max_age} वर्ष) में है",
                mr=f"वय {profile.age} वर्षे पात्र वयोगटात ({min_age} ते {max_age} वर्षे) बसते",
                lang=lang
            )
        )
        criteria_evals.append(CriteriaEvaluation(
            criteria_name="Age Eligibility",
            status="matched",
            message=f"{profile.age} years (Range: {min_age}-{max_age})"
        ))
    else:
        score -= 40
        if profile.age < min_age:
            unmet_reasons.append(
                get_localized_text(
                    en=f"Age {profile.age} is below minimum requirement of {min_age} years",
                    hi=f"आयु {profile.age} वर्ष न्यूनतम आवश्यकता {min_age} वर्ष से कम है",
                    mr=f"वय {profile.age} वर्षे किमान आवश्यक {min_age} वर्षांपेक्षा कमी आहे",
                    lang=lang
                )
            )
        else:
            unmet_reasons.append(
                get_localized_text(
                    en=f"Age {profile.age} exceeds maximum allowable age limit of {max_age} years",
                    hi=f"आयु {profile.age} वर्ष अधिकतम आयु सीमा {max_age} वर्ष से अधिक है",
                    mr=f"वय {profile.age} वर्षे कमाल वयोमर्यादा {max_age} वर्षांपेक्षा जास्त आहे",
                    lang=lang
                )
            )
        criteria_evals.append(CriteriaEvaluation(
            criteria_name="Age Eligibility",
            status="unmet",
            message=f"Required {min_age}-{max_age} years"
        ))
        hard_disqualification = True

    # 4. Income check
    max_income = rules.get("max_annual_income")
    if max_income is not None:
        if profile.annual_income <= max_income:
            matched_reasons.append(
                get_localized_text(
                    en=f"Household income ₹{profile.annual_income:,.0f} satisfies income limit (<= ₹{max_income:,.0f})",
                    hi=f"वार्षिक पारिवारिक आय ₹{profile.annual_income:,.0f} आय सीमा (<= ₹{max_income:,.0f}) के भीतर है",
                    mr=f"कौटुंबिक उत्पन्न ₹{profile.annual_income:,.0f} उत्पन्नाच्या मर्यादेत (<= ₹{max_income:,.0f}) आहे",
                    lang=lang
                )
            )
            criteria_evals.append(CriteriaEvaluation(
                criteria_name="Annual Income",
                status="matched",
                message=f"₹{profile.annual_income:,.0f} <= ₹{max_income:,.0f}"
            ))
        else:
            score -= 35
            unmet_reasons.append(
                get_localized_text(
                    en=f"Annual income ₹{profile.annual_income:,.0f} exceeds maximum ceiling of ₹{max_income:,.0f}",
                    hi=f"वार्षिक आय ₹{profile.annual_income:,.0f} अधिकतम सीमा ₹{max_income:,.0f} से अधिक है",
                    mr=f"वार्षिक उत्पन्न ₹{profile.annual_income:,.0f} कमाल मर्यादा ₹{max_income:,.0f} पेक्षा जास्त आहे",
                    lang=lang
                )
            )
            criteria_evals.append(CriteriaEvaluation(
                criteria_name="Annual Income",
                status="unmet",
                message=f"Exceeds ₹{max_income:,.0f}"
            ))
    else:
        matched_reasons.append(
            get_localized_text(
                en="No restrictive household income ceiling for this scheme",
                hi="इस योजना के लिए कोई प्रतिबंधात्मक आय सीमा नहीं है",
                mr="या योजनेसाठी उत्पन्नाची कोणतीही जाचक अट नाही",
                lang=lang
            )
        )
        criteria_evals.append(CriteriaEvaluation(
            criteria_name="Annual Income",
            status="matched",
            message="No income ceiling"
        ))

    # 5. Caste / Affirmative Action check
    req_caste = rules.get("caste_mandatory")
    if req_caste:
        if profile.caste_category.upper() == req_caste.upper():
            matched_reasons.append(
                get_localized_text(
                    en=f"Belongs to eligible category: {req_caste}",
                    hi=f"पात्र श्रेणी के अंतर्गत: {req_caste}",
                    mr=f"पात्र प्रवर्गात समाविष्ट: {req_caste}",
                    lang=lang
                )
            )
            criteria_evals.append(CriteriaEvaluation(
                criteria_name="Caste / Category",
                status="matched",
                message=f"Matches {req_caste}"
            ))
        else:
            hard_disqualification = True
            score -= 45
            unmet_reasons.append(
                get_localized_text(
                    en=f"Scheme is strictly earmarked for {req_caste} students. Your selected category is {profile.caste_category}.",
                    hi=f"यह योजना विशेष रूप से {req_caste} छात्रों के लिए आरक्षित है। आपकी श्रेणी {profile.caste_category} है।",
                    mr=f"ही योजना केवळ {req_caste} विद्यार्थ्यांसाठी राखीव आहे. तुमचा प्रवर्ग {profile.caste_category} आहे.",
                    lang=lang
                )
            )
            criteria_evals.append(CriteriaEvaluation(
                criteria_name="Caste / Category",
                status="unmet",
                message=f"Requires {req_caste}"
            ))
    else:
        # Special rule for Stand-Up India: Woman OR SC OR ST
        if rules.get("special_rule") == "Must be either Woman OR SC OR ST":
            is_woman = profile.gender.lower() == "female"
            is_sc_st = profile.caste_category.upper() in ["SC", "ST"]
            if is_woman or is_sc_st:
                matched_reasons.append(
                    get_localized_text(
                        en="Fulfills Stand-Up India target profile (Woman or SC/ST entrepreneur)",
                        hi="स्टैंड-अप इंडिया लक्षित वर्ग (महिला या एससी/एसटी उद्यमी) की पात्रता पूर्ण",
                        mr="स्टँड-अप इंडिया निकष पूर्ण (महिला किंवा SC/ST उद्योजक)",
                        lang=lang
                    )
                )
                criteria_evals.append(CriteriaEvaluation(
                    criteria_name="Target Group (SC/ST/Woman)",
                    status="matched",
                    message="Eligible as Woman/SC/ST"
                ))
            else:
                hard_disqualification = True
                score -= 40
                unmet_reasons.append(
                    get_localized_text(
                        en="Requires applicant to be either a Woman or belong to SC/ST category",
                        hi="आवेदक महिला या एससी/एसटी वर्ग से होना अनिवार्य है",
                        mr="अर्जदार महिला किंवा SC/ST प्रवर्गातील असणे आवश्यक",
                        lang=lang
                    )
                )
                criteria_evals.append(CriteriaEvaluation(
                    criteria_name="Target Group (SC/ST/Woman)",
                    status="unmet",
                    message="Requires SC/ST or Female"
                ))

    # 6. Occupation & Sector Specific Rules
    # Agriculture / Farmer
    if rules.get("is_farmer") or "farmer" in rules.get("occupations", []):
        if profile.is_farmer or profile.occupation == "farmer":
            matched_reasons.append(
                get_localized_text(
                    en="Target beneficiary: Farmer / Agriculture sector",
                    hi="लक्षित लाभार्थी: किसान / कृषि क्षेत्र",
                    mr="लक्षित लाभार्थी: शेतकरी / कृषी क्षेत्र",
                    lang=lang
                )
            )
            criteria_evals.append(CriteriaEvaluation(
                criteria_name="Farmer / Agricultural Status",
                status="matched",
                message="Farmer profile confirmed"
            ))
            if rules.get("requires_landholding"):
                if profile.has_landholding:
                    matched_reasons.append(
                        get_localized_text(
                            en="Cultivable landholding ownership confirmed",
                            hi="कृषि योग्य भूमि स्वामित्व की पुष्टि",
                            mr="शेतजमीन मालकी हक्काची पुष्टी",
                            lang=lang
                        )
                    )
                else:
                    info_needed.append(
                        get_localized_text(
                            en="Requires valid Land Record (7/12 extract or Patta) in beneficiary's name",
                            hi="लाभार्थी के नाम पर वैध खतौनी/पट्टा आवश्यक है",
                            mr="लाभार्थ्याच्या नावावर ७/१२ किंवा ८-अ उतारा आवश्यक आहे",
                            lang=lang
                        )
                    )
                    score -= 15
        else:
            score -= 40
            unmet_reasons.append(
                get_localized_text(
                    en="Scheme is specifically designed for practicing farmers",
                    hi="यह योजना विशेष रूप से किसानों के लिए बनाई गई है",
                    mr="ही योजना खास करून शेतकऱ्यांसाठी तयार केलेली आहे",
                    lang=lang
                )
            )
            criteria_evals.append(CriteriaEvaluation(
                criteria_name="Farmer Status",
                status="unmet",
                message="Non-farmer profile"
            ))

    # Student only
    if rules.get("student_only"):
        if profile.student_status or profile.occupation == "student":
            matched_reasons.append(
                get_localized_text(
                    en="Beneficiary is actively enrolled as a student",
                    hi="लाभार्थी वर्तमान में नियमित छात्र है",
                    mr="लाभार्थी सध्या नियमित विद्यार्थी म्हणून शिकत आहे",
                    lang=lang
                )
            )
            criteria_evals.append(CriteriaEvaluation(
                criteria_name="Student Status",
                status="matched",
                message="Enrolled student"
            ))
            if rules.get("education_level") and profile.education_level:
                if profile.education_level in ["undergraduate", "postgraduate", "vocational", "12th"]:
                    matched_reasons.append(
                        get_localized_text(
                            en=f"Education level aligns with scheme scope ({profile.education_level})",
                            hi=f"शैक्षणिक स्तर योजना के अनुरूप है ({profile.education_level})",
                            mr=f"शैक्षणिक स्तर योजनेशी सुसंगत आहे ({profile.education_level})",
                            lang=lang
                        )
                    )
        else:
            hard_disqualification = True
            score -= 45
            unmet_reasons.append(
                get_localized_text(
                    en="Requires active enrollment in recognized educational institution",
                    hi="मान्यता प्राप्त शैक्षणिक संस्थान में नियमित अध्ययनरत होना आवश्यक",
                    mr="मान्यताप्राप्त शिक्षण संस्थेत नियमित शिक्षण घेत असणे आवश्यक",
                    lang=lang
                )
            )
            criteria_evals.append(CriteriaEvaluation(
                criteria_name="Student Status",
                status="unmet",
                message="Not a student"
            ))

    # Entrepreneur / Business
    if rules.get("is_entrepreneur") or "entrepreneur" in rules.get("occupations", []):
        if profile.is_entrepreneur or profile.occupation in ["entrepreneur", "self_employed", "artisan", "street_vendor"]:
            matched_reasons.append(
                get_localized_text(
                    en="Matches entrepreneurial / micro-business profile",
                    hi="उद्यमी / सूक्ष्म व्यवसाय प्रोफ़ाइल के अनुकूल",
                    mr="उद्योजक किंवा लहान व्यवसाय प्रोफाइलशी जुळणारे",
                    lang=lang
                )
            )
            criteria_evals.append(CriteriaEvaluation(
                criteria_name="Business / Enterprise Activity",
                status="matched",
                message="Entrepreneur / Self-employed"
            ))
        else:
            score -= 20
            info_needed.append(
                get_localized_text(
                    en="Requires a proposed or active business activity plan",
                    hi="प्रस्तावित या सक्रिय व्यावसायिक योजना आवश्यक है",
                    mr="नव्या किंवा चालू व्यवसायाचा प्रकल्प अहवाल आवश्यक आहे",
                    lang=lang
                )
            )

    # Street vendor specific
    if "street_vendor" in rules.get("occupations", []):
        if profile.occupation == "street_vendor":
            matched_reasons.append(
                get_localized_text(
                    en="Direct match for urban street vending livelihood",
                    hi="शहरी स्ट्रीट वेंडर आजीविका के लिए सीधा मिलान",
                    mr="शहरी फेरीवाले व लहान विक्रेत्यांसाठी थेट जुळणारे",
                    lang=lang
                )
            )
        else:
            if scheme["id"] == "pm-svanidhi":
                score -= 30
                info_needed.append(
                    get_localized_text(
                        en="Requires vending certificate or recommendation letter from municipal body",
                        hi="नगर निकाय से वेंडिंग प्रमाण पत्र या अनुशंसा पत्र आवश्यक",
                        mr="नगरपालिका/महानगरपालिकेकडून फेरीवाला प्रमाणपत्र आवश्यक",
                        lang=lang
                    )
                )

    # Artisan specific (PM Vishwakarma)
    if "artisan" in rules.get("occupations", []):
        if profile.occupation in ["artisan", "self_employed"]:
            matched_reasons.append(
                get_localized_text(
                    en="Matches craftsperson / traditional trade profile",
                    hi="पारंपरिक शिल्पकार / कारीगर प्रोफ़ाइल से मेल खाता है",
                    mr="पारंपरिक कारागीर किंवा बलुतेदार प्रोफाइलशी जुळणारे",
                    lang=lang
                )
            )
        else:
            if scheme["id"] == "pm-vishwakarma-yojana":
                score -= 25
                info_needed.append(
                    get_localized_text(
                        en="Requires applicant to practice one of the 18 traditional artisan trades",
                        hi="18 पारंपरिक शिल्पों में से किसी एक में कार्यरत होना आवश्यक",
                        mr="१८ ठरवून दिलेल्या पारंपरिक व्यवसायांपैकी एका व्यवसायात कार्यरत असणे आवश्यक",
                        lang=lang
                    )
                )

    # Disability check
    if rules.get("disability_only"):
        if profile.is_differently_abled:
            matched_reasons.append(
                get_localized_text(
                    en="Matches Divyangjan / differently-abled welfare priority",
                    hi="दिव्यांगजन कल्याण प्राथमिकता से मेल खाता है",
                    mr="दिव्यांग व्यक्ती कल्याण प्राधान्याशी जुळणारे",
                    lang=lang
                )
            )
            criteria_evals.append(CriteriaEvaluation(
                criteria_name="Disability Certification",
                status="matched",
                message="UDID / Divyangjan verified"
            ))
        else:
            hard_disqualification = True
            score -= 50
            unmet_reasons.append(
                get_localized_text(
                    en="Scheme is exclusively meant for certified persons with disability (UDID >= 40%)",
                    hi="यह योजना केवल प्रमाणित दिव्यांगजनों (यूडीआईडी >= 40%) के लिए है",
                    mr="ही योजना केवळ प्रमाणित दिव्यांग व्यक्तींसाठी (UDID >= ४०%) आहे",
                    lang=lang
                )
            )
            criteria_evals.append(CriteriaEvaluation(
                criteria_name="Disability Certification",
                status="unmet",
                message="Requires UDID Card"
            ))

    # BPL check
    if rules.get("bpl_only"):
        if profile.is_bpl_ration_card_holder or profile.annual_income <= 100000:
            matched_reasons.append(
                get_localized_text(
                    en="Matches BPL / underprivileged income demographic",
                    hi="बीपीएल / वंचित वर्ग की आय सीमा से मेल खाता है",
                    mr="दारिद्र्यरेषेखालील (BPL) निकषांशी सुसंगत",
                    lang=lang
                )
            )
            criteria_evals.append(CriteriaEvaluation(
                criteria_name="BPL / Ration Card Status",
                status="matched",
                message="BPL criteria satisfied"
            ))
        else:
            score -= 30
            info_needed.append(
                get_localized_text(
                    en="Requires Below Poverty Line (BPL) Ration Card or Gram Sabha verification",
                    hi="बीपीएल राशन कार्ड या ग्राम सभा सत्यापन आवश्यक है",
                    mr="पिवळे रेशनकार्ड किंवा ग्रामसभेचे दारिद्र्यरेषेखालील प्रमाणपत्र आवश्यक",
                    lang=lang
                )
            )

    # Determine status and normalize score
    score = max(0, min(100, score))
    
    if hard_disqualification or score < 50:
        match_status = "NOT_ELIGIBLE"
    elif score >= 85 and len(unmet_reasons) == 0:
        match_status = "ELIGIBLE"
    else:
        match_status = "POTENTIALLY_ELIGIBLE"

    title = scheme.get(f"title_{lang}") or scheme.get("title_en")
    brief = scheme.get(f"brief_{lang}") or scheme.get("brief_en")
    benefits = scheme.get(f"benefits_{lang}") or scheme.get("benefits_en")

    return SchemeMatchResult(
        scheme_id=scheme["id"],
        slug=scheme["slug"],
        title=title,
        category=scheme["category"],
        level=scheme["level"],
        state_name=scheme["state_name"],
        ministry=scheme["ministry"],
        brief=brief,
        benefits=benefits,
        match_status=match_status,
        match_score=score,
        matched_reasons=matched_reasons,
        unmet_reasons=unmet_reasons,
        info_needed=info_needed,
        criteria_evaluations=criteria_evals,
        official_portal_url=scheme["official_portal_url"],
        application_mode=scheme["application_mode"],
        helpline_number=scheme.get("helpline_number")
    )

def get_localized_text(en: str, hi: str, mr: str, lang: str) -> str:
    if lang == "hi":
        return hi
    elif lang == "mr":
        return mr
    return en
