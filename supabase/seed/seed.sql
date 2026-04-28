-- ============================================
-- SEED DATA FOR ALL REGULATORY FRAMEWORKS
-- NDPA, CBN, SEC, NITDA
-- Supports: English (en), Yoruba (yo), Hausa (ha), Igbo (ig)
-- ============================================

-- ============================================
-- 1. NDPA FRAMEWORK
-- ============================================

-- Create NDPA Act regulation entry
INSERT INTO regulations (regulator_id, title, short_title, document_type, framework_name, effective_date, status)
SELECT id, 'Nigeria Data Protection Act 2023', 'NDPA 2023', 'act', 'NDPA', '2023-06-12', 'active'
FROM regulators WHERE acronym = 'NDPC'
ON CONFLICT (regulator_id, title, version) DO NOTHING;

-- NDPA Implementation Framework
INSERT INTO regulations (regulator_id, title, short_title, document_type, framework_name, effective_date, status)
SELECT id, 'NDPA Implementation Framework 2023', 'NDPA Framework', 'framework', 'NDPA', '2023-09-01', 'active'
FROM regulators WHERE acronym = 'NDPC'
ON CONFLICT (regulator_id, title, version) DO NOTHING;

-- ============================================
-- NDPA ENGLISH CLAUSES
-- ============================================
DO $$
DECLARE
    ndpa_act_id UUID;
BEGIN
    SELECT id INTO ndpa_act_id FROM regulations WHERE framework_name = 'NDPA' AND document_type = 'act' LIMIT 1;

    -- Section 24: Principles of Processing
    INSERT INTO regulatory_clauses (regulation_id, clause_number, title, content, clause_type, keywords, affected_sectors, framework_name, metadata)
    VALUES (
        ndpa_act_id,
        'Section 24',
        'Principles of Processing',
        'Data controllers and processors shall ensure that personal data is processed lawfully, fairly, and transparently. Personal data must be processed according to legal principles.',
        'principle',
        ARRAY['principles', 'lawful', 'fair', 'transparent', 'data processing'],
        ARRAY['fintech', 'healthtech', 'ecommerce', 'edtech', 'agritech', 'enterprise', 'social_media'],
        'NDPA',
        '{"plain_summary": "Personal data must be processed according to legal principles.", "language": "en"}'
    ) ON CONFLICT DO NOTHING;

    -- Section 25: Lawful Basis
    INSERT INTO regulatory_clauses (regulation_id, clause_number, title, content, clause_type, keywords, affected_sectors, framework_name, metadata)
    VALUES (
        ndpa_act_id,
        'Section 25',
        'Lawful Basis',
        'Processing shall be lawful only if a lawful basis applies. Data processing requires a valid legal basis like consent or contract.',
        'requirement',
        ARRAY['lawful basis', 'consent', 'contract', 'legitimate interest'],
        ARRAY['fintech', 'healthtech', 'ecommerce', 'edtech', 'agritech', 'enterprise', 'social_media'],
        'NDPA',
        '{"plain_summary": "Data processing requires a valid legal basis like consent or contract.", "language": "en"}'
    ) ON CONFLICT DO NOTHING;

    -- Section 26: Consent
    INSERT INTO regulatory_clauses (regulation_id, clause_number, title, content, clause_type, keywords, affected_sectors, framework_name, metadata)
    VALUES (
        ndpa_act_id,
        'Section 26',
        'Consent',
        'Consent must be freely given, specific, informed, and unambiguous. Consent requires clear affirmative action.',
        'obligation',
        ARRAY['consent', 'withdrawal', 'affirmative action'],
        ARRAY['fintech', 'healthtech', 'ecommerce', 'edtech', 'agritech', 'enterprise', 'social_media'],
        'NDPA',
        '{"plain_summary": "Consent requires clear affirmative action.", "language": "en"}'
    ) ON CONFLICT DO NOTHING;

    -- Section 27: Transparency
    INSERT INTO regulatory_clauses (regulation_id, clause_number, title, content, clause_type, keywords, affected_sectors, framework_name, metadata)
    VALUES (
        ndpa_act_id,
        'Section 27',
        'Transparency',
        'Controllers must provide information in a concise, transparent form. Organizations must clearly inform about data use.',
        'obligation',
        ARRAY['transparency', 'privacy policy', 'notice'],
        ARRAY['fintech', 'healthtech', 'ecommerce', 'edtech', 'agritech', 'enterprise', 'social_media'],
        'NDPA',
        '{"plain_summary": "Organizations must clearly inform about data use.", "language": "en"}'
    ) ON CONFLICT DO NOTHING;

    -- Section 30: Sensitive Data
    INSERT INTO regulatory_clauses (regulation_id, clause_number, title, content, clause_type, keywords, affected_sectors, framework_name, metadata)
    VALUES (
        ndpa_act_id,
        'Section 30',
        'Sensitive Data',
        'Processing of sensitive data is prohibited unless conditions apply. Special restrictions for health, biometric, religious data.',
        'prohibition',
        ARRAY['sensitive data', 'health', 'biometric'],
        ARRAY['fintech', 'healthtech', 'enterprise', 'social_media'],
        'NDPA',
        '{"plain_summary": "Special restrictions for health, biometric, religious data.", "language": "en"}'
    ) ON CONFLICT DO NOTHING;

    -- Section 31: Children
    INSERT INTO regulatory_clauses (regulation_id, clause_number, title, content, clause_type, keywords, affected_sectors, framework_name, metadata)
    VALUES (
        ndpa_act_id,
        'Section 31',
        'Children',
        'A child is any person under 18 years. Children under 18 require parental consent.',
        'obligation',
        ARRAY['children', 'minor', 'parental consent', 'under 18'],
        ARRAY['edtech', 'social_media', 'healthtech', 'ecommerce'],
        'NDPA',
        '{"plain_summary": "Children under 18 require parental consent.", "language": "en"}'
    ) ON CONFLICT DO NOTHING;

    -- Section 32: DPO Appointment
    INSERT INTO regulatory_clauses (regulation_id, clause_number, title, content, clause_type, keywords, affected_sectors, framework_name, metadata)
    VALUES (
        ndpa_act_id,
        'Section 32',
        'DPO Appointment',
        'Controllers of major importance must appoint a DPO. Certain organizations must designate a Data Protection Officer.',
        'obligation',
        ARRAY['DPO', 'data protection officer', 'governance'],
        ARRAY['fintech', 'healthtech', 'enterprise', 'social_media'],
        'NDPA',
        '{"plain_summary": "Certain organizations must designate a Data Protection Officer.", "language": "en"}'
    ) ON CONFLICT DO NOTHING;

    -- Section 39: Security Measures
    INSERT INTO regulatory_clauses (regulation_id, clause_number, title, content, clause_type, keywords, affected_sectors, framework_name, metadata)
    VALUES (
        ndpa_act_id,
        'Section 39',
        'Security Measures',
        'Implement appropriate technical and organizational measures. Protect data with encryption and access controls.',
        'obligation',
        ARRAY['security', 'encryption', 'access control'],
        ARRAY['fintech', 'healthtech', 'ecommerce', 'edtech', 'agritech', 'enterprise', 'social_media'],
        'NDPA',
        '{"plain_summary": "Protect data with encryption and access controls.", "language": "en"}'
    ) ON CONFLICT DO NOTHING;

    -- Section 40: Breach Notification
    INSERT INTO regulatory_clauses (regulation_id, clause_number, title, content, clause_type, keywords, affected_sectors, framework_name, metadata)
    VALUES (
        ndpa_act_id,
        'Section 40',
        'Breach Notification',
        'Notify NDPC within 72 hours of becoming aware of a breach. Report data breaches within 72 hours to NDPC.',
        'obligation',
        ARRAY['breach', 'notification', '72 hours', 'NDPC'],
        ARRAY['fintech', 'healthtech', 'ecommerce', 'edtech', 'agritech', 'enterprise', 'social_media'],
        'NDPA',
        '{"plain_summary": "Report data breaches within 72 hours to NDPC.", "language": "en"}'
    ) ON CONFLICT DO NOTHING;

    -- Section 44: Registration
    INSERT INTO regulatory_clauses (regulation_id, clause_number, title, content, clause_type, keywords, affected_sectors, framework_name, metadata)
    VALUES (
        ndpa_act_id,
        'Section 44',
        'Registration',
        'Data controllers of major importance must register with NDPC. DCPMIs must register with the Commission.',
        'obligation',
        ARRAY['registration', 'DCPMI', 'NDPC'],
        ARRAY['fintech', 'healthtech', 'ecommerce', 'enterprise', 'social_media'],
        'NDPA',
        '{"plain_summary": "DCPMIs must register with the Commission.", "language": "en"}'
    ) ON CONFLICT DO NOTHING;

END $$;

-- ============================================
-- NDPA YORUBA CLAUSES
-- ============================================
DO $$
DECLARE
    ndpa_act_id UUID;
BEGIN
    SELECT id INTO ndpa_act_id FROM regulations WHERE framework_name = 'NDPA' AND document_type = 'act' LIMIT 1;

    INSERT INTO regulatory_clauses (regulation_id, clause_number, title, content, clause_type, keywords, affected_sectors, framework_name, metadata) VALUES
    (ndpa_act_id, 'Section 24', 'Àwọn Ìlànà Ṣíṣe Ìtọ́jú Dátà Ẹni', 'Àwọn alákòóso dátà àti àwọn olùṣètò dátà gbọ́dọ̀ rí i dájú pé wọ́n ṣètò dátà àdání lọ́nà tí ó bófin mu, lọ́nà òdodo, àti lọ́nà tí ó hàn gbangba.', 'principle', ARRAY['ìlànà', 'bíbófin mu', 'òdodo', 'ìṣípayá'], ARRAY['fintech', 'healthtech', 'ecommerce', 'edtech', 'agritech', 'enterprise', 'social_media'], 'NDPA', '{"plain_summary": "A gbọ́dọ̀ ṣètò dátà àdání gẹ́gẹ́ bí àwọn ìlànà òfin.", "language": "yo"}'),
    (ndpa_act_id, 'Section 25', 'Ìdí Òfin Fún Ṣíṣètò Dátà Ẹni', 'Ṣíṣètò dátà àdání yóò jẹ́ èyí tí ó bófin mu nìkan tí ó bá jẹ́ pé ó kéré tán ọ̀kan nínú àwọn wọ̀nyí kan: ìyọ̀ǹda, àdéhùn, ojúṣe òfin.', 'requirement', ARRAY['ìdí òfin', 'ìyọ̀ǹda', 'àdéhùn', 'ojúṣe òfin'], ARRAY['fintech', 'healthtech', 'ecommerce', 'edtech', 'agritech', 'enterprise', 'social_media'], 'NDPA', '{"plain_summary": "Ṣíṣètò dátà nílò ìdí òfin tí ó wúlò.", "language": "yo"}'),
    (ndpa_act_id, 'Section 26', 'Ìyọ̀ǹda', 'Ìyọ̀ǹda gbọ́dọ̀ jẹ́ èyí tí a fi fúnni láìrówó, tí ó jẹ́ pàtó, tí a mọ̀, àti tí kò ní àìdánilójú.', 'obligation', ARRAY['ìyọ̀ǹda', 'fífagi lé', 'ìṣe tí ó hàn kedere'], ARRAY['fintech', 'healthtech', 'ecommerce', 'edtech', 'agritech', 'enterprise', 'social_media'], 'NDPA', '{"plain_summary": "Ìyọ̀ǹda gbọ́dọ̀ jẹ́ èyí tí a fi fúnni láìrówó.", "language": "yo"}'),
    (ndpa_act_id, 'Section 27', 'Ìṣípayá àti Ojúṣe Ìfitónilétí', 'Alákòóso yóò pèsè ìfitónilétí nínú èdè tí ó ṣe kedere àti tí ó rọrùn láti wọlé sí.', 'obligation', ARRAY['ìṣípayá', 'ètò àṣírí', 'ìfitónilétí'], ARRAY['fintech', 'healthtech', 'ecommerce', 'edtech', 'agritech', 'enterprise', 'social_media'], 'NDPA', '{"plain_summary": "Àwọn àjọ gbọ́dọ̀ sọ fún àwọn ẹni kọ̀ọ̀kan lọ́nà tí ó ṣe kedere.", "language": "yo"}'),
    (ndpa_act_id, 'Section 30', 'Dátà Ẹni Àkànṣe', 'Ṣíṣètò dátà àdání tí ń ṣípayá ẹ̀yà, èrò òṣèlú, ìgbàgbọ́ ẹ̀sìn, tàbí dátà ìlera jẹ́ èyí tí a kà léèwọ̀.', 'prohibition', ARRAY['dátà àkànṣe', 'ìlera', 'onínú ara', 'apilẹ̀ àbùdá'], ARRAY['fintech', 'healthtech', 'enterprise', 'social_media'], 'NDPA', '{"plain_summary": "Àwọn ìhámọ́ pàtàkì kan àwọn dátà àkànṣe.", "language": "yo"}'),
    (ndpa_act_id, 'Section 31', 'Ṣíṣètò Dátà Àwọn Ọmọdé', 'Ọmọdé jẹ́ ẹnikẹ́ni tí kò tí ì pé ọmọ ọdún 18. Àwọn ọmọdé nílò ìyọ̀ǹda òbí.', 'obligation', ARRAY['àwọn ọmọdé', 'ọ̀dọ́', 'ìyọ̀ǹda òbí', 'lábẹ́ 18'], ARRAY['edtech', 'social_media', 'healthtech', 'ecommerce'], 'NDPA', '{"plain_summary": "Àwọn ọmọdé tí kò tí ì pé 18 nílò ìyọ̀ǹda òbí.", "language": "yo"}'),
    (ndpa_act_id, 'Section 32', 'Ọ̀gá Ààbò Dátà', 'Alákòóso dátà tí ó ṣe pàtàkì yóò yan Ọ̀gá Ààbò Dátà pẹ̀lú ìmọ̀ ìjìnlẹ̀.', 'obligation', ARRAY['DPO', 'ọ̀gá ààbò dátà', 'yíyàn', 'ìṣàkóso'], ARRAY['fintech', 'healthtech', 'enterprise', 'social_media'], 'NDPA', '{"plain_summary": "Àwọn àjọ kan gbọ́dọ̀ yan Ọ̀gá Ààbò Dátà.", "language": "yo"}'),
    (ndpa_act_id, 'Section 39', 'Ààbò Ṣíṣètò', 'Alákòóso yóò mú àwọn ìgbésẹ̀ ìmọ̀ ẹ̀rọ àti ti ètò tí ó yẹ láti dáàbò bo dátà.', 'obligation', ARRAY['ààbò', 'ìpamọ́ kóòdù', 'ìfarawe ìdánimọ̀'], ARRAY['fintech', 'healthtech', 'ecommerce', 'edtech', 'agritech', 'enterprise', 'social_media'], 'NDPA', '{"plain_summary": "Dáàbò bo dátà pẹ̀lú ìpamọ́ kóòdù.", "language": "yo"}'),
    (ndpa_act_id, 'Section 40', 'Ìfitónilétí Ìrúfin Dátà Ẹni', 'Jábọ̀ ìrúfin dátà fún NDPC láàárín wákàtí 72.', 'obligation', ARRAY['ìrúfin', 'ìfitónilétí', 'wákàtí 72', 'NDPC'], ARRAY['fintech', 'healthtech', 'ecommerce', 'edtech', 'agritech', 'enterprise', 'social_media'], 'NDPA', '{"plain_summary": "Jábọ̀ ìrúfin dátà fún NDPC láàárín wákàtí 72.", "language": "yo"}'),
    (ndpa_act_id, 'Section 44', 'Ìforúkọsílẹ̀', 'Àwọn alákòóso dátà tí ó ṣe pàtàkì yóò forúkọsílẹ̀ lọ́dọ̀ Kọmíṣọ́nnà.', 'obligation', ARRAY['ìforúkọsílẹ̀', 'DCPMI', 'NDPC', 'ìbámu'], ARRAY['fintech', 'healthtech', 'ecommerce', 'enterprise', 'social_media'], 'NDPA', '{"plain_summary": "DCPMI gbọ́dọ̀ forúkọsílẹ̀ lọ́dọ̀ NDPC.", "language": "yo"}')
    ON CONFLICT DO NOTHING;
END $$;

-- ============================================
-- NDPA HAUSA CLAUSES
-- ============================================
DO $$
DECLARE
    ndpa_act_id UUID;
BEGIN
    SELECT id INTO ndpa_act_id FROM regulations WHERE framework_name = 'NDPA' AND document_type = 'act' LIMIT 1;

    INSERT INTO regulatory_clauses (regulation_id, clause_number, title, content, clause_type, keywords, affected_sectors, framework_name, metadata) VALUES
    (ndpa_act_id, 'Section 24', 'Ka''idojin Sarrafa Bayanan Mutum', 'Duk mai sarrafa bayani ko mataimakinsa ya tabbatar cewa bayanai na mutum: a yi adalci a wajen sarrafa shi, halattacce, da kuma adalci.', 'principle', ARRAY['ka''idoji', 'halatta', 'adalci', 'gaskiya'], ARRAY['fintech', 'healthtech', 'ecommerce', 'edtech', 'agritech', 'enterprise', 'social_media'], 'NDPA', '{"plain_summary": "Dole a sarrafa bayanan sirri bisa ka''idojin doka.", "language": "ha"}'),
    (ndpa_act_id, 'Section 25', 'Halattaccen Dalilin Sarrafa Bayanai', 'Doka ta yarda a sarrafa bayanan mutum idan daya daga cikin wadannan ya faru: yardar mai bayani, aiwatar da kwangila, bin wajibcin doka.', 'requirement', ARRAY['tushen doka', 'yarda', 'kwangila', 'wajibcin doka'], ARRAY['fintech', 'healthtech', 'ecommerce', 'edtech', 'agritech', 'enterprise', 'social_media'], 'NDPA', '{"plain_summary": "Sarrafa bayanai na bukatar ingantaccen tushe na doka.", "language": "ha"}'),
    (ndpa_act_id, 'Section 26', 'Yarda', 'Yarda shi ne yardar mutum ta hanyar furuci ko a rubuce, ko a aikace ta ba da dama a yi amfani da bayanan sirrinsu.', 'obligation', ARRAY['yarda', 'janyewa', 'tabbataccen aiki'], ARRAY['fintech', 'healthtech', 'ecommerce', 'edtech', 'agritech', 'enterprise', 'social_media'], 'NDPA', '{"plain_summary": "Dole yarda ta kasance ta son rai, takamaimai, sanarwa.", "language": "ha"}'),
    (ndpa_act_id, 'Section 27', 'Gaskiya da Wajibcin Bayar da Bayani', 'Mai sarrafa bayani zai dauki matakan da suka dace don bayar da bayanin a harshe bayyananne kuma mai sauki.', 'obligation', ARRAY['gaskiya', 'manufar sirri', 'bayani', 'sanarwa'], ARRAY['fintech', 'healthtech', 'ecommerce', 'edtech', 'agritech', 'enterprise', 'social_media'], 'NDPA', '{"plain_summary": "Dole kungiyoyi su sanar da mutane a fili.", "language": "ha"}'),
    (ndpa_act_id, 'Section 30', 'Bayanan Sirri Masu Muhimmanci', 'Sarrafa bayanan sirri da ke bayyana asalin launin fata ko kabila, ra''ayoyin siyasa, akidar addini ko falsafa haramun ne.', 'prohibition', ARRAY['bayanai masu muhimmanci', 'lafiya', 'nazarin halittu', 'rukunai na musamman'], ARRAY['fintech', 'healthtech', 'enterprise', 'social_media'], 'NDPA', '{"plain_summary": "Ƙuntatawa ta musamman ta shafi bayanai masu muhimmanci.", "language": "ha"}'),
    (ndpa_act_id, 'Section 31', 'Sarrafa Bayanan Yara', 'Yaro shi ne duk wanda bai kai shekara 18 ba. Yara ''yan ƙasa da shekara 18 suna buƙatar yardar iyaye.', 'obligation', ARRAY['yara', 'ƙanana', 'yardar iyaye', 'ƙasa da 18'], ARRAY['edtech', 'social_media', 'healthtech', 'ecommerce'], 'NDPA', '{"plain_summary": "Yara ''yan ƙasa da shekara 18 suna buƙatar yardar iyaye.", "language": "ha"}'),
    (ndpa_act_id, 'Section 32', 'Jami''in Kare Bayanai', 'Mai sarrafa bayanai mai muhimmanci zai nada Jami''in Kare Bayanai mai ƙwararrun ilimi.', 'obligation', ARRAY['DPO', 'jami''in kare bayanai', 'nada', 'shugabanci'], ARRAY['fintech', 'healthtech', 'enterprise', 'social_media'], 'NDPA', '{"plain_summary": "Dole a nada Jami''in Kare Bayanai mai ƙwararrun ilimi.", "language": "ha"}'),
    (ndpa_act_id, 'Section 39', 'Tsaron Sarrafawa', 'Mai sarrafawa zai aiwatar da matakan fasaha da na ƙungiya don tabbatar da matakin tsaro.', 'obligation', ARRAY['tsaro', 'ɓoye bayanai', 'ɓoye suna', 'sirri'], ARRAY['fintech', 'healthtech', 'ecommerce', 'edtech', 'agritech', 'enterprise', 'social_media'], 'NDPA', '{"plain_summary": "Dole kungiyoyi su kare bayanan sirri.", "language": "ha"}'),
    (ndpa_act_id, 'Section 40', 'Sanarwar ɓoyewar Bayanan Sirri', 'A ba da rahoton ɓoyewar bayanai ga NDPC cikin sa''o''i 72.', 'obligation', ARRAY['ɓoyewa', 'sanarwa', 'sa''o''i 72', 'NDPC'], ARRAY['fintech', 'healthtech', 'ecommerce', 'edtech', 'agritech', 'enterprise', 'social_media'], 'NDPA', '{"plain_summary": "A ba da rahoton ɓoyewar bayanai ga NDPC cikin sa''o''i 72.", "language": "ha"}'),
    (ndpa_act_id, 'Section 44', 'Rajista', 'Masu sarrafa bayanai masu muhimmanci za su yi rajista da Hukumar cikin watanni shida.', 'obligation', ARRAY['rajista', 'DCPMI', 'NDPC', 'gabatarwa'], ARRAY['fintech', 'healthtech', 'ecommerce', 'enterprise', 'social_media'], 'NDPA', '{"plain_summary": "DCPMI dole su yi rajista da NDPC.", "language": "ha"}')
    ON CONFLICT DO NOTHING;
END $$;

-- ============================================
-- NDPA IGBO CLAUSES
-- ============================================
DO $$
DECLARE
    ndpa_act_id UUID;
BEGIN
    SELECT id INTO ndpa_act_id FROM regulations WHERE framework_name = 'NDPA' AND document_type = 'act' LIMIT 1;

    INSERT INTO regulatory_clauses (regulation_id, clause_number, title, content, clause_type, keywords, affected_sectors, framework_name, metadata) VALUES
    (ndpa_act_id, 'Section 24', 'Ụkpụrụ nke Nhazi Data Onwe', 'Ndị na-achịkwa data na ndị na-eme data ga-ahụ na a na-ahazi data onwe n''ụzọ iwu kwadoro, n''ụzọ ziri ezi, na n''ụzọ doro anya.', 'principle', ARRAY['ụkpụrụ', 'iwu kwadoro', 'izi ezi', 'nghọta'], ARRAY['fintech', 'healthtech', 'ecommerce', 'edtech', 'agritech', 'enterprise', 'social_media'], 'NDPA', '{"plain_summary": "A ga-ahazirịrị data onwe dịka ụkpụrụ iwu siri dị.", "language": "ig"}'),
    (ndpa_act_id, 'Section 25', 'Ntọala Iwu Kwadoro Maka Nhazi Data', 'Nhazi data onwe ga-abụ nke iwu kwadoro naanị ma ọ bụrụ na opekata mpe otu n''ime ihe ndị a metụtara: nkwenye, nkwekọrịta, ọrụ iwu.', 'requirement', ARRAY['ntọala iwu', 'nkwenye', 'nkwekọrịta', 'ọrụ iwu'], ARRAY['fintech', 'healthtech', 'ecommerce', 'edtech', 'agritech', 'enterprise', 'social_media'], 'NDPA', '{"plain_summary": "Nhazi data chọrọ ntọala iwu ziri ezi.", "language": "ig"}'),
    (ndpa_act_id, 'Section 26', 'Nkwenye', 'Nkwenye ga-abụ nke e nyere n''efu, nke akọwapụtara, nke a maara, na nke doro anya site na omume doro anya.', 'obligation', ARRAY['nkwenye', 'mwepu', 'omume doro anya'], ARRAY['fintech', 'healthtech', 'ecommerce', 'edtech', 'agritech', 'enterprise', 'social_media'], 'NDPA', '{"plain_summary": "Nkwenye ga-abụ nke e nyere n''efu, nke akọwapụtara.", "language": "ig"}'),
    (ndpa_act_id, 'Section 27', 'Nghọta na Ọrụ Ozi', 'Onye na-achịkwa ga-enye ozi gbasara nhazi n''ụdị nkenke, nghọta, na asụsụ doro anya.', 'obligation', ARRAY['nghọta', 'amụma nzuzo', 'ozi', 'ọkwa'], ARRAY['fintech', 'healthtech', 'ecommerce', 'edtech', 'agritech', 'enterprise', 'social_media'], 'NDPA', '{"plain_summary": "Ụlọ ọrụ ga-agwara ndị mmadụ n''ụzọ doro anya.", "language": "ig"}'),
    (ndpa_act_id, 'Section 30', 'Data Onwe Dị Nro', 'Nhazi data onwe nke na-ekpughe agbụrụ, echiche ndọrọ ndọrọ ọchịchị, nkwenye okpukpe ga-abụ nke a machibidoro iwu.', 'prohibition', ARRAY['data dị nro', 'ahụike', 'biometric', 'udi pụrụ iche'], ARRAY['fintech', 'healthtech', 'enterprise', 'social_media'], 'NDPA', '{"plain_summary": "Mmachi pụrụ iche metụtara data dị nro.", "language": "ig"}'),
    (ndpa_act_id, 'Section 31', 'Nhazi Data Ụmụaka', 'Nwata bụ onye ọ bụla na-erubeghị afọ 18. Ụmụaka na-erubeghị afọ 18 chọrọ nkwenye nne na nna.', 'obligation', ARRAY['ụmụaka', 'onye na-erubeghị afọ', 'nkwenye nne na nna', 'n''okpuru 18'], ARRAY['edtech', 'social_media', 'healthtech', 'ecommerce'], 'NDPA', '{"plain_summary": "Ụmụaka na-erubeghị afọ 18 chọrọ nkwenye nne na nna.", "language": "ig"}'),
    (ndpa_act_id, 'Section 32', 'Onye Ọrụ Nchekwa Data', 'Onye na-achịkwa data dị oke mkpa ga-ahọpụta Onye Ọrụ Nchekwa Data nwere ọkachamara.', 'obligation', ARRAY['DPO', 'onye ọrụ nchekwa data', 'nhọpụta', 'ọchịchị'], ARRAY['fintech', 'healthtech', 'enterprise', 'social_media'], 'NDPA', '{"plain_summary": "Ụlọ ọrụ ga-ahọpụta Onye Ọrụ Nchekwa Data.", "language": "ig"}'),
    (ndpa_act_id, 'Section 39', 'Nchekwa nke Nhazi', 'Onye na-achịkwa ga-emejuputa usoro nka na ụzụ iji hụ na nchekwa kwekọrọ n''ihe ize ndụ.', 'obligation', ARRAY['nchekwa', 'izo ya ezo', 'pseudonymization', 'nzuzo'], ARRAY['fintech', 'healthtech', 'ecommerce', 'edtech', 'agritech', 'enterprise', 'social_media'], 'NDPA', '{"plain_summary": "Ụlọ ọrụ ga-echekwa data onwe site na izo ya ezo.", "language": "ig"}'),
    (ndpa_act_id, 'Section 40', 'Ọkwa Mgbasa Ozi Maka Mmebi Data Onwe', 'Kọọrọ NDPC mmebi data n''ime awa 72.', 'obligation', ARRAY['mmebi', 'ọkwa', 'awa 72', 'NDPC'], ARRAY['fintech', 'healthtech', 'ecommerce', 'edtech', 'agritech', 'enterprise', 'social_media'], 'NDPA', '{"plain_summary": "Kọọrọ NDPC mmebi data n''ime awa 72.", "language": "ig"}'),
    (ndpa_act_id, 'Section 44', 'Ndebanye Aha', 'Ndị na-achịkwa data dị oke mkpa ga-edebanye aha na Kọmishọn n''ime ọnwa isii.', 'obligation', ARRAY['ndebanye aha', 'DCPMI', 'NDPC', 'ịgba akwụkwọ'], ARRAY['fintech', 'healthtech', 'ecommerce', 'enterprise', 'social_media'], 'NDPA', '{"plain_summary": "DCPMI ga-edebanye aha na NDPC.", "language": "ig"}')
    ON CONFLICT DO NOTHING;
END $$;

-- ============================================
-- 2. CBN FRAMEWORK - ALL LANGUAGES
-- ============================================

-- Create CBN regulation entries
INSERT INTO regulations (regulator_id, title, short_title, document_type, framework_name, effective_date, status)
SELECT id, 'CBN Anti-Money Laundering/Combating Financing of Terrorism Regulations 2022', 'CBN AML/CFT 2022', 'regulation', 'CBN-AML', '2022-09-01', 'active'
FROM regulators WHERE acronym = 'CBN'
ON CONFLICT (regulator_id, title, version) DO NOTHING;

INSERT INTO regulations (regulator_id, title, short_title, document_type, framework_name, effective_date, status)
SELECT id, 'CBN Consumer Protection Regulations 2019', 'CBN Consumer Protection', 'regulation', 'CBN-CP', '2019-11-01', 'active'
FROM regulators WHERE acronym = 'CBN'
ON CONFLICT (regulator_id, title, version) DO NOTHING;

INSERT INTO regulations (regulator_id, title, short_title, document_type, framework_name, effective_date, status)
SELECT id, 'CBN Guidelines on Mobile Money Services in Nigeria', 'CBN Mobile Money', 'guideline', 'CBN-MMO', '2021-07-01', 'active'
FROM regulators WHERE acronym = 'CBN'
ON CONFLICT (regulator_id, title, version) DO NOTHING;

-- ============================================
-- CBN AML - ENGLISH CLAUSES
-- ============================================
DO $$
DECLARE
    cbn_aml_id UUID;
BEGIN
    SELECT id INTO cbn_aml_id FROM regulations WHERE framework_name = 'CBN-AML' LIMIT 1;

    -- CBN AML Section 3.1: CDD
    INSERT INTO regulatory_clauses (regulation_id, clause_number, title, content, clause_type, keywords, affected_sectors, framework_name, metadata)
    VALUES (
        cbn_aml_id,
        'Section 3.1',
        'Customer Due Diligence Requirements',
        'Financial institutions shall conduct Customer Due Diligence (CDD) measures including: (a) identifying and verifying the identity of customers using reliable and independent source documents, data or information; (b) identifying the beneficial owner and taking reasonable measures to verify the identity of the beneficial owner; (c) understanding and obtaining information on the purpose and intended nature of the business relationship; (d) conducting ongoing due diligence on the business relationship and scrutinizing transactions. Enhanced due diligence shall apply to higher-risk categories of customers, business relationships or transactions including politically exposed persons and cross-border correspondent relationships.',
        'obligation',
        ARRAY['KYC', 'customer due diligence', 'CDD', 'beneficial owner', 'verification', 'enhanced due diligence', 'PEP', 'cross-border'],
        ARRAY['fintech', 'ecommerce'],
        'CBN-AML',
        '{"plain_summary": "Financial institutions must verify customer identity, identify beneficial owners, understand business purpose, and conduct ongoing monitoring. Enhanced checks for high-risk customers and PEPs.", "language": "en"}'
    ) ON CONFLICT DO NOTHING;

    -- CBN AML Section 6.2: Penalties
    INSERT INTO regulatory_clauses (regulation_id, clause_number, title, content, clause_type, keywords, affected_sectors, framework_name, metadata)
    VALUES (
        cbn_aml_id,
        'Section 6.2',
        'Penalties for Non-Compliance',
        'Any financial institution that fails to comply with the provisions of these Regulations shall be liable to a penalty of not less than N1,000,000 for each day during which the infraction continues. The Governor may also suspend or revoke the license of the institution and may take any other action deemed appropriate.',
        'penalty',
        ARRAY['penalty', 'fine', 'N1,000,000', 'license revocation', 'non-compliance', 'sanction', 'daily penalty'],
        ARRAY['fintech', 'ecommerce'],
        'CBN-AML',
        '{"plain_summary": "Non-compliance attracts daily penalty of N1,000,000 and possible license revocation by the CBN Governor.", "language": "en"}'
    ) ON CONFLICT DO NOTHING;

    -- CBN AML Section 7.1: Reporting
    INSERT INTO regulatory_clauses (regulation_id, clause_number, title, content, clause_type, keywords, affected_sectors, framework_name, metadata)
    VALUES (
        cbn_aml_id,
        'Section 7.1',
        'Suspicious Transaction Reporting',
        'Financial institutions shall report to the Nigerian Financial Intelligence Unit (NFIU) any suspicious transaction within 24 hours of the transaction occurring. Reports shall be made immediately upon suspicion and shall include all relevant details of the transaction and the parties involved.',
        'obligation',
        ARRAY['suspicious transaction', 'NFIU', 'reporting', '24 hours', 'STR', 'financial intelligence'],
        ARRAY['fintech', 'ecommerce'],
        'CBN-AML',
        '{"plain_summary": "Report suspicious transactions to NFIU within 24 hours with full transaction details.", "language": "en"}'
    ) ON CONFLICT DO NOTHING;

END $$;

-- ============================================
-- CBN AML - YORUBA CLAUSES
-- ============================================
DO $$
DECLARE
    cbn_aml_id UUID;
BEGIN
    SELECT id INTO cbn_aml_id FROM regulations WHERE framework_name = 'CBN-AML' LIMIT 1;

    INSERT INTO regulatory_clauses (regulation_id, clause_number, title, content, clause_type, keywords, affected_sectors, framework_name, metadata) VALUES
    (
        cbn_aml_id,
        'Section 3.1',
        'Àwọn Ìbéèrè Ìṣàyẹ̀wò Oníbárà',
        'Àwọn ilé-iṣẹ́ ìnáwó gbọ́dọ̀ ṣe àwọn ìgbésẹ̀ Ìṣàyẹ̀wò Oníbárà pẹ̀lú: dídámọ̀ àti fífìdí ìdánimọ̀ àwọn oníbárà, dídámọ̀ ẹni tí ó ní àǹfààní, mímọ ète ìbáṣepọ̀ ìṣòwò, àti ṣíṣe àtẹ̀léba ìṣàyẹ̀wò. A gbọ́dọ̀ ṣe ìṣàyẹ̀wò tí ó ga jù fún àwọn oníbárà tí ó wà nínú ewu gíga.',
        'obligation',
        ARRAY['KYC', 'ìṣàyẹ̀wò oníbárà', 'CDD', 'ẹni tí ó ní àǹfààní', 'fífìdí', 'ìṣàyẹ̀wò tí ó ga jù', 'PEP'],
        ARRAY['fintech', 'ecommerce'],
        'CBN-AML',
        '{"plain_summary": "Àwọn ilé-iṣẹ́ ìnáwó gbọ́dọ̀ fìdí ìdánimọ̀ oníbárà múlẹ̀ kí wọ́n sì mọ ẹni tí ó ní àǹfààní.", "language": "yo"}'
    ),
    (
        cbn_aml_id,
        'Section 6.2',
        'Àwọn Ìtanràn fún Àìbámu',
        'Ilé-iṣẹ́ ìnáwó èyíkéyìí tí kò bá tẹ̀lé àwọn ìpèsè Ìlànà wọ̀nyí yóò jẹ̀bi ìtanràn tí kò dín ní N1,000,000 fún ọjọ́ kọ̀ọ̀kan tí ìrúfin náà bá ń bá a lọ. Gómìnà lè dáwọ́ ìwé-àṣẹ ilé-iṣẹ́ náà dúró tàbí kí ó fagi lé e.',
        'penalty',
        ARRAY['ìtanràn', 'owó ìtanràn', 'N1,000,000', 'fífagi lé ìwé-àṣẹ', 'àìbámu', 'ìjẹnìyà'],
        ARRAY['fintech', 'ecommerce'],
        'CBN-AML',
        '{"plain_summary": "Àìbámu ń fà ìtanràn ojoojúmọ́ N1,000,000 àti fífagi lé ìwé-àṣẹ tí ó ṣeéṣe.", "language": "yo"}'
    ),
    (
        cbn_aml_id,
        'Section 7.1',
        'Ìjábọ̀ Ìdúnàdúrà Ifura',
        'Àwọn ilé-iṣẹ́ ìnáwó gbọ́dọ̀ jábọ̀ fún Ẹ̀ka Ọ̀tẹlẹ̀múyẹ́ Ìnáwó ti Nàìjíríà (NFIU) èyíkéyìí ìdúnàdúrà ifura láàárín wákàtí 24 tí ìdúnàdúrà náà bá ti wáyé.',
        'obligation',
        ARRAY['ìdúnàdúrà ifura', 'NFIU', 'ìjábọ̀', 'wákàtí 24', 'STR', 'ọ̀tẹlẹ̀múyẹ́ ìnáwó'],
        ARRAY['fintech', 'ecommerce'],
        'CBN-AML',
        '{"plain_summary": "Jábọ̀ ìdúnàdúrà ifura fún NFIU láàárín wákàtí 24 pẹ̀lú ẹ̀kúnrẹ́rẹ́ ìdúnàdúrà.", "language": "yo"}'
    )
    ON CONFLICT DO NOTHING;
END $$;

-- ============================================
-- CBN AML - HAUSA CLAUSES
-- ============================================
DO $$
DECLARE
    cbn_aml_id UUID;
BEGIN
    SELECT id INTO cbn_aml_id FROM regulations WHERE framework_name = 'CBN-AML' LIMIT 1;

    INSERT INTO regulatory_clauses (regulation_id, clause_number, title, content, clause_type, keywords, affected_sectors, framework_name, metadata) VALUES
    (
        cbn_aml_id,
        'Section 3.1',
        'Bukatun Binciken Abokin Ciniki',
        'Cibiyoyin kudi za su gudanar da matakan Binciken Abokin Ciniki (CDD) ciki har da: gano da tabbatar da ainihin abokan ciniki, gano mai cin gajiyar, fahimtar manufar dangantakar kasuwanci, da gudanar da ci gaba da bincike. Za a yi amfani da ingantaccen bincike ga abokan ciniki masu haɗari, mutanen da aka fallasa a siyasa, da dangantakar ƙetare iyaka.',
        'obligation',
        ARRAY['KYC', 'binciken abokin ciniki', 'CDD', 'mai cin gajiyar', 'tabbatarwa', 'ingantaccen bincike', 'PEP'],
        ARRAY['fintech', 'ecommerce'],
        'CBN-AML',
        '{"plain_summary": "Cibiyoyin kudi dole su tabbatar da ainihin abokin ciniki, gano mai cin gajiyar, da fahimtar manufar kasuwanci.", "language": "ha"}'
    ),
    (
        cbn_aml_id,
        'Section 6.2',
        'Hukunci kan Rashin Biyayya',
        'Duk wata cibiyar kudi da ta kasa bin tanadin wadannan Dokokin za a ci tarar da ba ta gaza N1,000,000 a kowace rana yayin da take ci gaba da keta dokar. Gwamna na iya dakatar ko soke lasisin cibiyar kuma ya iya daukar duk wani matakin da ya ga dama.',
        'penalty',
        ARRAY['hukunci', 'tara', 'N1,000,000', 'soke lasisi', 'rashin biyayya', 'takunkumi'],
        ARRAY['fintech', 'ecommerce'],
        'CBN-AML',
        '{"plain_summary": "Rashin biyayya yana jawo tarar N1,000,000 kowace rana da yiwuwar soke lasisi daga Gwamnan CBN.", "language": "ha"}'
    ),
    (
        cbn_aml_id,
        'Section 7.1',
        'Rahoton Mu''amala Mai Tuhuma',
        'Cibiyoyin kudi za su kai rahoto ga Hukumar Leken Kudi ta Najeriya (NFIU) duk wata mu''amala mai tuhuma cikin sa''o''i 24 da faruwar mu''amalar. Za a gabatar da rahotanni nan da nan bayan zargin kuma za su haɗa da duk cikakkun bayanai na mu''amalar da waɗanda abin ya shafa.',
        'obligation',
        ARRAY['mu''amala mai tuhuma', 'NFIU', 'rahoto', 'sa''o''i 24', 'STR', 'leken kudi'],
        ARRAY['fintech', 'ecommerce'],
        'CBN-AML',
        '{"plain_summary": "Kai rahoton mu''amala mai tuhuma ga NFIU cikin sa''o''i 24 tare da cikakkun bayanan mu''amalar.", "language": "ha"}'
    )
    ON CONFLICT DO NOTHING;
END $$;

-- ============================================
-- CBN AML - IGBO CLAUSES
-- ============================================
DO $$
DECLARE
    cbn_aml_id UUID;
BEGIN
    SELECT id INTO cbn_aml_id FROM regulations WHERE framework_name = 'CBN-AML' LIMIT 1;

    INSERT INTO regulatory_clauses (regulation_id, clause_number, title, content, clause_type, keywords, affected_sectors, framework_name, metadata) VALUES
    (
        cbn_aml_id,
        'Section 3.1',
        'Ihe Ndị A Chọrọ Maka Nnyocha Ndị Ahịa',
        'Ụlọ ọrụ ego ga-eme usoro Nnyocha Ndị Ahịa (CDD) gụnyere: ịchọpụta na ịkwado njirimara ndị ahịa, ịchọpụta onye nwe uru, ịghọta ebumnuche mmekọrịta azụmahịa, na ịme nnyocha na-aga n''ihu. A ga-etinye nnyocha ka mma maka ndị ahịa nọ n''ihe ize ndụ dị elu, ndị e kpughere na ndọrọ ndọrọ ọchịchị, na mmekọrịta gafere ókèala.',
        'obligation',
        ARRAY['KYC', 'nnyocha ndị ahịa', 'CDD', 'onye nwe uru', 'nkwado', 'nnyocha ka mma', 'PEP'],
        ARRAY['fintech', 'ecommerce'],
        'CBN-AML',
        '{"plain_summary": "Ụlọ ọrụ ego ga-akwado njirimara ndị ahịa, chọpụta onye nwe uru, na ịghọta ebumnuche azụmahịa.", "language": "ig"}'
    ),
    (
        cbn_aml_id,
        'Section 6.2',
        'Ntaramahụhụ Maka Enweghị Nrubeisi',
        'Ụlọ ọrụ ego ọ bụla nke na-agbasoghị usoro Iwu ndị a ga-atụ ụgwọ ntaramahụhụ nke na-erughị N1,000,000 maka ụbọchị ọ bụla mmebi iwu ahụ na-aga n''ihu. Gọvanọ nwekwara ike ịkwụsịtụ ma ọ bụ kagbuo ikike ụlọ ọrụ ahụ.',
        'penalty',
        ARRAY['ntaramahụhụ', 'ụgwọ', 'N1,000,000', 'ịkagbu ikike', 'enweghị nrubeisi', 'mmachi'],
        ARRAY['fintech', 'ecommerce'],
        'CBN-AML',
        '{"plain_summary": "Enweghị nrubeisi na-ebute ụgwọ N1,000,000 kwa ụbọchị na ịkagbu ikike site n''aka Gọvanọ CBN.", "language": "ig"}'
    ),
    (
        cbn_aml_id,
        'Section 7.1',
        'Mkpesa Azụmahịa Na-enyo Enyo',
        'Ụlọ ọrụ ego ga-akọrọ Ụlọ Ọrụ Ọgụgụ Isi Ego nke Naịjirịa (NFIU) azụmahịa ọ bụla na-enyo enyo n''ime awa 24 nke azụmahịa ahụ mere. A ga-enyefe mkpesa ozugbo enwee enyo ma ga-agụnye nkọwa niile dị mkpa nke azụmahịa ahụ na ndị metụtara.',
        'obligation',
        ARRAY['azụmahịa na-enyo enyo', 'NFIU', 'mkpesa', 'awa 24', 'STR', 'ọgụgụ isi ego'],
        ARRAY['fintech', 'ecommerce'],
        'CBN-AML',
        '{"plain_summary": "Kọọrọ NFIU azụmahịa na-enyo enyo n''ime awa 24 na nkọwa azụmahịa zuru ezu.", "language": "ig"}'
    )
    ON CONFLICT DO NOTHING;
END $$;

-- ============================================
-- CBN CONSUMER PROTECTION - ALL LANGUAGES
-- ============================================
DO $$
DECLARE
    cbn_cp_id UUID;
BEGIN
    SELECT id INTO cbn_cp_id FROM regulations WHERE framework_name = 'CBN-CP' LIMIT 1;

    -- ENGLISH
    INSERT INTO regulatory_clauses (regulation_id, clause_number, title, content, clause_type, keywords, affected_sectors, framework_name, metadata) VALUES
    (
        cbn_cp_id,
        'Section 4.2',
        'Consumer Data Privacy and Protection',
        'Financial service providers shall: (a) protect the privacy and confidentiality of consumer information; (b) not disclose consumer information to third parties without the express consent of the consumer; (c) implement appropriate data security measures to prevent unauthorized access, alteration, or destruction of consumer data; (d) comply with the Nigeria Data Protection Regulation and any subsequent data protection laws.',
        'obligation',
        ARRAY['consumer privacy', 'confidentiality', 'data protection', 'NDPR compliance', 'consumer consent', 'data security'],
        ARRAY['fintech', 'ecommerce'],
        'CBN-CP',
        '{"plain_summary": "Financial service providers must protect consumer data privacy and comply with data protection laws.", "language": "en"}'
    ),
    -- YORUBA
    (
        cbn_cp_id,
        'Section 4.2',
        'Àṣírí Dátà Oníbárà àti Dídáàbòbò',
        'Àwọn olùpèsè iṣẹ́ ìnáwó gbọ́dọ̀: (a) dáàbò bo àṣírí àti ìkọ̀kọ̀ ìsọfúnni oníbárà; (b) má ṣe fi ìsọfúnni oníbárà hàn fún ẹnìkan kẹta láìsí ìyọ̀ǹda tí ó hàn kedere; (c) mú àwọn ìgbésẹ̀ ààbò dátà tí ó yẹ ṣe; (d) tẹ̀lé Ìlànà Dídáàbòbò Dátà ti Nàìjíríà.',
        'obligation',
        ARRAY['àṣírí oníbárà', 'ìkọ̀kọ̀', 'dídáàbòbò dátà', 'ìbámu NDPR', 'ìyọ̀ǹda oníbárà'],
        ARRAY['fintech', 'ecommerce'],
        'CBN-CP',
        '{"plain_summary": "Àwọn olùpèsè iṣẹ́ ìnáwó gbọ́dọ̀ dáàbò bo àṣírí dátà oníbárà.", "language": "yo"}'
    ),
    -- HAUSA
    (
        cbn_cp_id,
        'Section 4.2',
        'Sirrin Bayanan Abokin Ciniki da Kariya',
        'Masu ba da sabis na kudi za su: (a) kare sirri da tsare bayanan abokin ciniki; (b) kar su bayyana bayanan abokin ciniki ga wasu ba tare da izinin abokin ciniki ba; (c) aiwatar da matakan tsaron bayanai masu dacewa; (d) bi Dokar Kare Bayanai ta Najeriya.',
        'obligation',
        ARRAY['sirrin abokin ciniki', 'tsarewa', 'kare bayanai', 'bin NDPR', 'izinin abokin ciniki'],
        ARRAY['fintech', 'ecommerce'],
        'CBN-CP',
        '{"plain_summary": "Masu ba da sabis na kudi dole su kare sirrin bayanan abokin ciniki.", "language": "ha"}'
    ),
    -- IGBO
    (
        cbn_cp_id,
        'Section 4.2',
        'Nzuzo Data Ndị Ahịa na Nchebe',
        'Ndị na-enye ọrụ ego ga: (a) chebe nzuzo na nzuzo nke ozi ndị ahịa; (b) ghara ikpughe ozi ndị ahịa nye ndị ọzọ na-enweghị nkwenye doro anya nke onye ahịa; (c) mejuputa usoro nchekwa data kwesịrị ekwesị; (d) rubere Iwu Nchebe Data nke Naịjirịa isi.',
        'obligation',
        ARRAY['nzuzo ndị ahịa', 'nzuzo', 'nchebe data', 'nrubeisi NDPR', 'nkwenye ndị ahịa'],
        ARRAY['fintech', 'ecommerce'],
        'CBN-CP',
        '{"plain_summary": "Ndị na-enye ọrụ ego ga-echebe nzuzo data ndị ahịa ma rubere iwu nchebe data isi.", "language": "ig"}'
    )
    ON CONFLICT DO NOTHING;
END $$;

-- ============================================
-- 3. SEC FRAMEWORK - ALL LANGUAGES
-- ============================================

-- Create SEC regulation entries
INSERT INTO regulations (regulator_id, title, short_title, document_type, framework_name, effective_date, status)
SELECT id, 'SEC Rules on Crowdfunding 2021', 'SEC Crowdfunding Rules', 'regulation', 'SEC-CF', '2021-01-01', 'active'
FROM regulators WHERE acronym = 'SEC'
ON CONFLICT (regulator_id, title, version) DO NOTHING;

INSERT INTO regulations (regulator_id, title, short_title, document_type, framework_name, effective_date, status)
SELECT id, 'SEC Code of Conduct for Capital Market Operators', 'SEC Code of Conduct', 'code', 'SEC-CONDUCT', '2020-06-01', 'active'
FROM regulators WHERE acronym = 'SEC'
ON CONFLICT (regulator_id, title, version) DO NOTHING;

-- ============================================
-- SEC CROWDFUNDING - ALL LANGUAGES
-- ============================================
DO $$
DECLARE
    sec_cf_id UUID;
BEGIN
    SELECT id INTO sec_cf_id FROM regulations WHERE framework_name = 'SEC-CF' LIMIT 1;

    -- ENGLISH
    INSERT INTO regulatory_clauses (regulation_id, clause_number, title, content, clause_type, keywords, affected_sectors, framework_name, metadata) VALUES
    (
        sec_cf_id,
        'Rule 4.2',
        'Crowdfunding Portal Registration and Requirements',
        'A crowdfunding portal shall: (a) be registered with the Commission; (b) have a minimum paid-up capital of N100 million; (c) maintain proper books of accounts and financial records; (d) implement adequate investor protection measures including risk disclosure, investor education, and complaint handling mechanisms; (e) conduct due diligence on issuers using the platform including background checks and verification of business information.',
        'requirement',
        ARRAY['crowdfunding', 'portal registration', 'capital requirement', 'N100 million', 'investor protection', 'due diligence', 'background checks'],
        ARRAY['fintech', 'enterprise'],
        'SEC-CF',
        '{"plain_summary": "Crowdfunding portals must register with SEC, maintain N100 million capital, and implement investor protection measures.", "language": "en"}'
    ),
    -- YORUBA
    (
        sec_cf_id,
        'Rule 4.2',
        'Ìforúkọsílẹ̀ Póòtù Ìkówójọ àti Àwọn Ìbéèrè',
        'Póòtù ìkówójọ gbọ́dọ̀: (a) forúkọsílẹ̀ lọ́dọ̀ Kọmíṣọ́nnà; (b) ní owó olú tí kò dín ní N100 mílíọ̀nù; (c) tọ́jú ìwé ìṣirò àti àwọn àkọsílẹ̀ ìnáwó; (d) mú àwọn ìgbésẹ̀ dídáàbòbò afówósí ṣe; (e) ṣe ìwádìí lórí àwọn olùfowósi.',
        'requirement',
        ARRAY['ìkówójọ', 'ìforúkọsílẹ̀ póòtù', 'owó olú', 'N100 mílíọ̀nù', 'dídáàbòbò afówósí', 'ìwádìí'],
        ARRAY['fintech', 'enterprise'],
        'SEC-CF',
        '{"plain_summary": "Póòtù ìkówójọ gbọ́dọ̀ forúkọsílẹ̀ lọ́dọ̀ SEC, ní N100 mílíọ̀nù, kí wọ́n sì dáàbò bo afówósí.", "language": "yo"}'
    ),
    -- HAUSA
    (
        sec_cf_id,
        'Rule 4.2',
        'Rajistar Tashar Tattara Kuɗi da Bukatu',
        'Tashar tattara kuɗi za ta: (a) yi rajista da Hukumar; (b) sami mafi ƙarancin jarin da aka biya na Naira miliyan 100; (c) kula da ingantattun littattafan asusu; (d) aiwatar da isassun matakan kare masu saka hannun jari; (e) gudanar da bincike kan masu fitarwa ta amfani da dandamali.',
        'requirement',
        ARRAY['tattara kuɗi', 'rajistar tashar', 'bukatun jari', 'Naira miliyan 100', 'kare masu saka hannun jari', 'bincike'],
        ARRAY['fintech', 'enterprise'],
        'SEC-CF',
        '{"plain_summary": "Tashar tattara kuɗi dole ta yi rajista da SEC, ta sami Naira miliyan 100, ta kuma kare masu saka hannun jari.", "language": "ha"}'
    ),
    -- IGBO
    (
        sec_cf_id,
        'Rule 4.2',
        'Ndebanye Aha Ọnụ Ụzọ Ịchịkọta Ego na Ihe Ndị A Chọrọ',
        'Ọnụ ụzọ ịchịkọta ego ga: (a) debanye aha na Kọmịshọn; (b) nwee opekata mpe isi ego akwụgoro nke N100 nde; (c) debe akwụkwọ ndekọ ego kwesịrị ekwesị; (d) mejuputa usoro nchebe ndị na-etinye ego; (e) mee nnyocha nke ọma na ndị na-ewepụta ego.',
        'requirement',
        ARRAY['ịchịkọta ego', 'ndebanye aha ọnụ ụzọ', 'isi ego', 'N100 nde', 'nchebe ndị na-etinye ego', 'nnyocha'],
        ARRAY['fintech', 'enterprise'],
        'SEC-CF',
        '{"plain_summary": "Ọnụ ụzọ ịchịkọta ego ga-edebanye aha na SEC, nwee N100 nde, ma chebe ndị na-etinye ego.", "language": "ig"}'
    );

    -- ENGLISH - Rule 8.1 Investor Protection
    INSERT INTO regulatory_clauses (regulation_id, clause_number, title, content, clause_type, keywords, affected_sectors, framework_name, metadata) VALUES
    (
        sec_cf_id,
        'Rule 8.1',
        'Investor Protection Measures',
        'Crowdfunding portals shall implement measures to protect investors including: (a) mandatory risk acknowledgment forms before investment; (b) investment limits for retail investors not exceeding 10% of annual income; (c) cooling-off period of 48 hours during which investors may withdraw their investment; (d) escrow arrangements for investor funds; (e) transparent disclosure of all fees, charges, and potential conflicts of interest.',
        'obligation',
        ARRAY['investor protection', 'risk disclosure', 'investment limits', 'cooling-off period', 'escrow', 'transparency', '48 hours'],
        ARRAY['fintech', 'enterprise'],
        'SEC-CF',
        '{"plain_summary": "Investors must receive risk disclosures, have investment limits, and get 48-hour cooling-off period to withdraw.", "language": "en"}'
    ),
    -- YORUBA
    (
        sec_cf_id,
        'Rule 8.1',
        'Àwọn Ìgbésẹ̀ Dídáàbòbò Afówósí',
        'Àwọn póòtù ìkówójọ gbọ́dọ̀: (a) pèsè àwọn fọ́ọ̀mù ìdánimọ̀ ewu kí wọ́n tó náwó; (b) fi ààlà sáà àwọn afówósí tí kò gbọ́dọ̀ kọjá 10% owó tí wọ́n ń gbà lọ́dún; (c) fún wọn ní àkókò wákàtí 48 láti fagi lé; (d) tọ́jú owó afówósí nínú àpòpamọ́; (e) ṣí àwọn owó iṣẹ́ payá.',
        'obligation',
        ARRAY['dídáàbòbò afówósí', 'ìṣípayá ewu', 'ààlà ìnáwó', 'àkókò fífagi lé', 'àpòpamọ́', 'ìṣípayá'],
        ARRAY['fintech', 'enterprise'],
        'SEC-CF',
        '{"plain_summary": "Afówósí gbọ́dọ̀ gba ìṣípayá ewu kí wọ́n sì ní àkókò wákàtí 48 láti fagi lé.", "language": "yo"}'
    ),
    -- HAUSA
    (
        sec_cf_id,
        'Rule 8.1',
        'Matakan Kare Masu Saka Hannun Jari',
        'Tashoshin tattara kuɗi za su aiwatar da matakan kare masu saka hannun jari ciki har da: (a) fom ɗin amincewa da haɗari kafin saka hannun jari; (b) iyakokin saka hannun jari ga masu saka hannun jari marasa girman da ba za su wuce 10% na kudin shiga na shekara ba; (c) lokacin sanyaya zuciya na sa''o''i 48; (d) tsare-tsaren ajiyar kuɗi; (e) bayyana duk wasu kuɗaɗe, caji, da yiwuwar rikice-rikicen sha''awa.',
        'obligation',
        ARRAY['kare masu saka hannun jari', 'bayyana haɗari', 'iyakokin saka hannun jari', 'lokacin sanyaya zuciya', 'ajiye kuɗi', 'bayyana gaskiya'],
        ARRAY['fintech', 'enterprise'],
        'SEC-CF',
        '{"plain_summary": "Masu saka hannun jari dole su karɓi bayanin haɗari, su sami iyakokin saka hannun jari, da sa''o''i 48 lokacin sanyaya zuciya.", "language": "ha"}'
    ),
    -- IGBO
    (
        sec_cf_id,
        'Rule 8.1',
        'Usoro Nchebe Ndị Na-etinye Ego',
        'Ọnụ ụzọ ịchịkọta ego ga-emejuputa usoro iji chebe ndị na-etinye ego gụnyere: (a) ụdị nkwenye ihe ize ndụ tupu itinye ego; (b) oke itinye ego maka ndị na-etinye ego na-ere ahịa nke na-agaghị agafe 10% nke ego ha na-enweta kwa afọ; (c) oge ịjụ oyi nke awa 48; (d) nhazi nchekwa ego; (e) ngosipụta doro anya nke ụgwọ, ọnụ ahịa, na esemokwu nwere ike ime.',
        'obligation',
        ARRAY['nchebe ndị na-etinye ego', 'ngosipụta ihe ize ndụ', 'oke itinye ego', 'oge ịjụ oyi', 'nchekwa ego', 'ngosipụta doro anya'],
        ARRAY['fintech', 'enterprise'],
        'SEC-CF',
        '{"plain_summary": "Ndị na-etinye ego ga-enweta ngosipụta ihe ize ndụ, nwee oke itinye ego, na oge ịjụ oyi nke awa 48.", "language": "ig"}'
    )
    ON CONFLICT DO NOTHING;
END $$;

-- ============================================
-- 4. NITDA FRAMEWORK - ALL LANGUAGES
-- ============================================

-- Create NITDA regulation entries
INSERT INTO regulations (regulator_id, title, short_title, document_type, framework_name, effective_date, status)
SELECT id, 'NITDA Nigeria Data Protection Regulation Implementation Framework', 'NDPR Framework', 'framework', 'NITDA-DP', '2020-11-01', 'active'
FROM regulators WHERE acronym = 'NITDA'
ON CONFLICT (regulator_id, title, version) DO NOTHING;

INSERT INTO regulations (regulator_id, title, short_title, document_type, framework_name, effective_date, status)
SELECT id, 'NITDA Guidelines for Nigerian Content Development in ICT', 'NITDA Local Content', 'guideline', 'NITDA-LC', '2021-03-01', 'active'
FROM regulators WHERE acronym = 'NITDA'
ON CONFLICT (regulator_id, title, version) DO NOTHING;

-- ============================================
-- NITDA DP - ALL LANGUAGES
-- ============================================
DO $$
DECLARE
    nitda_dp_id UUID;
BEGIN
    SELECT id INTO nitda_dp_id FROM regulations WHERE framework_name = 'NITDA-DP' LIMIT 1;

    -- ENGLISH
    INSERT INTO regulatory_clauses (regulation_id, clause_number, title, content, clause_type, keywords, affected_sectors, framework_name, metadata) VALUES
    (
        nitda_dp_id,
        'Article 3.1',
        'Data Protection Compliance Requirements',
        'Every organization that processes personal data of more than 1000 data subjects within a period of six months shall: (a) appoint a Data Protection Officer; (b) conduct annual Data Protection Impact Assessments; (c) publish a privacy policy on their website or make it readily available to the public; (d) maintain a data inventory of all personal data processing activities; (e) implement data breach notification procedures; (f) ensure continuous capacity building for personnel involved in data processing.',
        'obligation',
        ARRAY['compliance', 'DPO', 'privacy policy', 'data inventory', 'impact assessment', 'breach notification', 'capacity building', '1000 data subjects'],
        ARRAY['fintech', 'healthtech', 'ecommerce', 'edtech', 'agritech', 'enterprise', 'social_media'],
        'NITDA-DP',
        '{"plain_summary": "Organizations processing data of 1000+ individuals must appoint DPO, conduct assessments, publish privacy policy, and maintain data inventory.", "language": "en"}'
    ),
    -- YORUBA
    (
        nitda_dp_id,
        'Article 3.1',
        'Àwọn Ìbéèrè Ìbámu Dídáàbòbò Dátà',
        'Gbogbo àjọ tí ó ń ṣètò dátà àdání àwọn ẹni tí ó ju 1000 lọ láàárín oṣù mẹ́fà gbọ́dọ̀: (a) yan Ọ̀gá Dídáàbòbò Dátà; (b) ṣe Àwọn Ìṣàyẹ̀wò Ipa Dídáàbòbò Dátà lọ́dọọdún; (c) tẹ ìlànà àṣírí sí orí ìkànnì wọn; (d) tọ́jú àkọsílẹ̀ dátà; (e) mú àwọn ìlànà ìfitónilétí ìrúfin dátà ṣe; (f) rí i pé àwọn òṣìṣẹ́ ń gba ìdálẹ́kọ̀ọ́.',
        'obligation',
        ARRAY['ìbámu', 'DPO', 'ìlànà àṣírí', 'àkọsílẹ̀ dátà', 'ìṣàyẹ̀wò ipa', 'ìfitónilétí ìrúfin'],
        ARRAY['fintech', 'healthtech', 'ecommerce', 'edtech', 'agritech', 'enterprise', 'social_media'],
        'NITDA-DP',
        '{"plain_summary": "Àwọn àjọ tí ń ṣètò dátà 1000+ gbọ́dọ̀ yan DPO, ṣe ìṣàyẹ̀wò, tẹ ìlànà àṣírí, kí wọ́n sì tọ́jú àkọsílẹ̀ dátà.", "language": "yo"}'
    ),
    -- HAUSA
    (
        nitda_dp_id,
        'Article 3.1',
        'Bukatun Biyayya da Kare Bayanai',
        'Kowace ƙungiya da ke sarrafa bayanan mutum fiye da 1000 a cikin watanni shida za ta: (a) nada Jami''in Kare Bayanai; (b) gudanar da Kimar Tasirin Kare Bayanai na shekara-shekara; (c) buga manufar sirri a shafin yanar gizon su; (d) kula da ƙididdigar bayanai; (e) aiwatar da hanyoyin sanar da ɓoyewar bayanai; (f) tabbatar da ci gaba da ƙarfafa ma''aikata.',
        'obligation',
        ARRAY['biyayya', 'DPO', 'manufar sirri', 'ƙididdigar bayanai', 'kimar tasiri', 'sanar da ɓoyewa'],
        ARRAY['fintech', 'healthtech', 'ecommerce', 'edtech', 'agritech', 'enterprise', 'social_media'],
        'NITDA-DP',
        '{"plain_summary": "Ƙungiyoyi masu sarrafa bayanan 1000+ dole su nada DPO, gudanar da kimomi, buga manufar sirri, da kula da ƙididdigar bayanai.", "language": "ha"}'
    ),
    -- IGBO
    (
        nitda_dp_id,
        'Article 3.1',
        'Ihe Ndị A Chọrọ Maka Nrubeisi Nchebe Data',
        'Ụlọ ọrụ ọ bụla nke na-ahazi data onwe nke ihe karịrị mmadụ 1000 n''ime ọnwa isii ga: (a) họpụta Onye Ọrụ Nchebe Data; (b) mee Nnyocha Mmetụta Nchebe Data kwa afọ; (c) bipụta amụma nzuzo na weebụsaịtị ha; (d) debe ndekọ data; (e) mejuputa usoro ọkwa mmebi data; (f) hụ na ọzụzụ na-aga n''ihu maka ndị ọrụ.',
        'obligation',
        ARRAY['nrubeisi', 'DPO', 'amụma nzuzo', 'ndekọ data', 'nnyocha mmetụta', 'ọkwa mmebi'],
        ARRAY['fintech', 'healthtech', 'ecommerce', 'edtech', 'agritech', 'enterprise', 'social_media'],
        'NITDA-DP',
        '{"plain_summary": "Ụlọ ọrụ na-ahazi data 1000+ ga-ahọpụta DPO, mee nnyocha, bipụta amụma nzuzo, ma debe ndekọ data.", "language": "ig"}'
    );

    -- ENGLISH - Article 4.2 Breach Notification
    INSERT INTO regulatory_clauses (regulation_id, clause_number, title, content, clause_type, keywords, affected_sectors, framework_name, metadata) VALUES
    (
        nitda_dp_id,
        'Article 4.2',
        'Data Breach Notification Requirements',
        'In the event of a data breach, the organization shall notify: (a) NITDA within 72 hours of becoming aware of the breach; (b) affected data subjects without undue delay where the breach is likely to result in high risk to their rights and freedoms. The notification shall include: the nature of the breach, categories and approximate number of data subjects affected, likely consequences, and measures taken or proposed to be taken to address the breach.',
        'obligation',
        ARRAY['data breach', 'notification', '72 hours', 'NITDA', 'data subjects', 'incident response', 'high risk'],
        ARRAY['fintech', 'healthtech', 'ecommerce', 'edtech', 'agritech', 'enterprise', 'social_media'],
        'NITDA-DP',
        '{"plain_summary": "Report data breaches to NITDA within 72 hours. Notify affected individuals if high risk to their rights.", "language": "en"}'
    ),
    -- YORUBA
    (
        nitda_dp_id,
        'Article 4.2',
        'Àwọn Ìbéèrè Ìfitónilétí Ìrúfin Dátà',
        'Ní ọ̀ràn ìrúfin dátà, àjọ náà gbọ́dọ̀: (a) fi tó NITDA létí láàárín wákàtí 72; (b) fi tó àwọn ẹni tí ó kàn án létí tí ìrúfin náà bá lè fa ewu gíga. Ìfitónilétí náà gbọ́dọ̀ ní: irú ìrúfin náà, àwọn ẹ̀ka àti iye àwọn tí ó kàn án, àwọn àbájáde tí ó ṣeéṣe, àti àwọn ìgbésẹ̀ tí a gbé.',
        'obligation',
        ARRAY['ìrúfin dátà', 'ìfitónilétí', 'wákàtí 72', 'NITDA', 'ẹni tí ó ní dátà', 'ìdáhùn sí ìṣẹ̀lẹ̀'],
        ARRAY['fintech', 'healthtech', 'ecommerce', 'edtech', 'agritech', 'enterprise', 'social_media'],
        'NITDA-DP',
        '{"plain_summary": "Jábọ̀ ìrúfin dátà fún NITDA láàárín wákàtí 72. Sọ fún àwọn tí ó kàn án bí ewu bá ga.", "language": "yo"}'
    ),
    -- HAUSA
    (
        nitda_dp_id,
        'Article 4.2',
        'Bukatun Sanar da ɓoyewar Bayanai',
        'A yayin ɓoyewar bayanai, ƙungiyar za ta sanar: (a) NITDA cikin sa''o''i 72; (b) masu bayanan da abin ya shafa ba tare da bata lokaci ba inda ɓoyewar ke iya haifar da babban haɗari. Sanarwar za ta haɗa da: yanayin ɓoyewar, rukunoni da kimanin adadin masu bayanan, yiwuwar sakamako, da matakan da aka ɗauka.',
        'obligation',
        ARRAY['ɓoyewar bayanai', 'sanarwa', 'sa''o''i 72', 'NITDA', 'masu bayanan', 'amsa lamarin'],
        ARRAY['fintech', 'healthtech', 'ecommerce', 'edtech', 'agritech', 'enterprise', 'social_media'],
        'NITDA-DP',
        '{"plain_summary": "Kai rahoton ɓoyewar bayanai ga NITDA cikin sa''o''i 72. Sanar da waɗanda abin ya shafa idan akwai babban haɗari.", "language": "ha"}'
    ),
    -- IGBO
    (
        nitda_dp_id,
        'Article 4.2',
        'Ihe Ndị A Chọrọ Maka Ọkwa Mgbasa Ozi Maka Mmebi Data',
        'N''ihe gbasara mmebi data, ụlọ ọrụ ga-agwa: (a) NITDA n''ime awa 72; (b) ndị nwe data metụtara n''egbughị oge ebe mmebi ahụ nwere ike ibute nnukwu ihe ize ndụ. Ọkwa ahụ ga-agụnye: ụdị mmebi ahụ, udi na ọnụ ọgụgụ ndị metụtara, ihe nwere ike isi na ya pụta, na usoro ndị e mere ma ọ bụ atụmatụ ime iji dozie mmebi ahụ.',
        'obligation',
        ARRAY['mmebi data', 'ọkwa', 'awa 72', 'NITDA', 'ndị nwe data', 'nzaghachi merenụ'],
        ARRAY['fintech', 'healthtech', 'ecommerce', 'edtech', 'agritech', 'enterprise', 'social_media'],
        'NITDA-DP',
        '{"plain_summary": "Kọọrọ NITDA mmebi data n''ime awa 72. Gwa ndị metụtara ma ọ bụrụ na enwere nnukwu ihe ize ndụ.", "language": "ig"}'
    )
    ON CONFLICT DO NOTHING;
END $$;

-- ============================================
-- CREATE VECTOR INDEX (if data exists)
-- ============================================
DO $$
DECLARE
    row_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO row_count FROM regulatory_clauses WHERE content_embedding IS NOT NULL;
    IF row_count > 0 THEN
        CREATE INDEX IF NOT EXISTS idx_clauses_embedding 
        ON regulatory_clauses 
        USING ivfflat (content_embedding vector_cosine_ops)
        WITH (lists = 100);
    END IF;
END $$;

-- ============================================
-- UPDATE SEQUENCES
-- ============================================
SELECT setval(pg_get_serial_sequence('regulators', 'id'), COALESCE((SELECT MAX(id) FROM regulators), 1));
SELECT setval(pg_get_serial_sequence('sectors', 'id'), COALESCE((SELECT MAX(id) FROM sectors), 1));
