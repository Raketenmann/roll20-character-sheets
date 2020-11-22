const buttonlist = ["character","combat","configuration"];
    buttonlist.forEach(button => {
        on(`clicked:${button}`, function() {
            setAttrs({
                sheetTab: button
            });
        });
    });
    
    on("change:janus change:hexxen change:rollvaluename", () =>{
        getAttrs(["janus", "hexxen", "rollvaluename"], function(values) {
            let janusValue = parseInt(values["janus"],10)||0;
            let attributeValue = parseInt(values["hexxen"],10)||0;
            let rollvaluename = values["hexxen"];
            let query = "&{template:check} {{name=@{character_name}}}";
            if(rollvaluename)
            {
                query = query + " {{attr=@{rollvaluename}}}";
                query = query + " {{attr_val="+attributeValue+"}}";
            }
            var i;
            for (i = 1; i <= attributeValue; i++) {
                query = query + " {{hexxen"+i+"=[[d6cs>5]]}}";
            }
            for (i = 1; i <= janusValue; i++) {
                query = query + " {{janus"+i+"=[[d6cs>4cf]]}}";
            }
            setAttrs({                            
                rollquery: query
            });
        });
    });

    on(`clicked:resetroll`, function(value) {
        setAttrs({
            hexxen: 0,
            janus: 0,
            rollvaluename: ' ',
            rollattribute: ' ',
            rollmodifiers: ' '
        });
    });
   
    const rolllist = [
    'attribute_strength',
     'attribute_athletic',
      'attribute_dexterity',
       'attribute_senses',
        'attribute_knowledge',
        'attribute_willpower',
     'skill_acrobatics_max',
        'skill_alertness_max',
        'skill_perception_max',
        'skill_firstaid_max',
        'skill_sleightofhand_max',
        'skill_mentalpower_max',
        'skill_crafting_max',
        'skill_stealth_max',
        'skill_countryandpeople_max',
        'skill_rhetoric_max',
        'skill_flexing_max',
        'skill_reflexes_max',
        'skill_riding_max',
        'skill_insensibility_max',
        'skill_fieldsofknowledge_max',
        'weapon_punch_max',
        'weapon_dagger_max',
        'weapon_fencing_max',
        'weapon_swords_max',
        'weapon_scimitar_max',
        'weapon_impact_max',
        'weapon_polearm_max',
        'weapon_lance_max',
        'weapon_sling_max',
        'weapon_pistol_max',
        'weapon_crossbow_max',
        'weapon_musket_max',
        'weapon_dodge_max',
        'weapon_shield_max'];
    rolllist.forEach(button => {
        on(`clicked:${button}`, function() {
            getAttrs([button], function(values) {
                let v = parseInt(values[button],10)||0;
                let baseattribute = "???"; 
                let valuename = "???";
                let key = button;
                if(key.endsWith('_max'))
                {
                    key = key.replace('_max', '');
                    baseattribute = skills[key].att; 
                    valuename = getTranslationByKey(key)+"["+getTranslationByKey(baseattribute+"_short")+"]";
                }
                else if(key.startsWith('attribute_'))
                {
                    baseattribute = key;
                    valuename = getTranslationByKey(key);
                }

                fillPossibleMods( [key, baseattribute] );
                setAttrs({
                    hexxen: v,
                    rollvaluename: valuename,
                    rollattribute: baseattribute
                });
            });
        });
    });

    var fillPossibleMods = function(attributes) {
        var mods = [];
        var itemfields = [];
        getSectionIDs("repeating_effects", function(idarray) {

            _.each(idarray, function(currentID, i) {
                console.log("id2:"+currentID);
                itemfields.push("repeating_effects_" + currentID + "_name");
                itemfields.push("repeating_effects_" + currentID + "_source");
                itemfields.push("repeating_effects_" + currentID + "_target");
                itemfields.push("repeating_effects_" + currentID + "_bonus");
            });
            getAttrs(itemfields, function(v) {
                var bonus_sum = 0;
                _.each(idarray, function(currentID) {
                    
                    var target = v["repeating_effects_" + currentID + "_target"];
                    console.log("target:"+target);
                    if(attributes.indexOf(target) > -1)
                    {
                        var modname = v["repeating_effects_" + currentID + "_name"];
                        var bonus = parseInt(v["repeating_effects_" + currentID + "_bonus"],10);
                        var bonusstring = bonus.toString();
                        if(bonus > 0)
                            bonusstring = "+"+bonusstring;
                        bonus_sum += bonus;
                        console.log("targetmatch!:"+modname);
                        mods.push(modname + " "+bonusstring);
                    }      
                });
                if(mods.length > 0)
                    setAttrs({
                        rollmodifiers: mods.join(),
                        janus: bonus_sum
                    });
                else
                    setAttrs({
                        rollmodifiers: ' ',
                        janus: 0
                    });
            });
         });
        return mods;
    };

    const parrylist = [
        'parry_weapon_punch_max',
        'parry_weapon_dagger_max',
        'parry_weapon_fencing_max',
        'parry_weapon_swords_max',
        'parry_weapon_scimitar_max',
        'parry_weapon_impact_max',
        'parry_weapon_polearm_max',
        'parry_weapon_lance_max',
        'parry_weapon_sling_max',
        'parry_weapon_pistol_max',
        'parry_weapon_crossbow_max',
        'parry_weapon_musket_max',
        'parry_weapon_dodge_max',
        'parry_weapon_shield_max'];
    parrylist.forEach(button => {
        on(`clicked:${button}`, function() {
            let key = button;
            key = key.replace('parry_','');
            getAttrs([key], function(values) {
                
                
                let v = parseInt(values[key],10)||0;
                let baseattribute = "???"; 
                let valuename = "???";

                if(key.endsWith('_max'))
                {
                    key = key.replace('_max', '');
                    baseattribute = skills[key].att; 
                    valuename = getTranslationByKey(key) + " (Parry) ["+getTranslationByKey(baseattribute+"_short")+"]";;
                }

                fillPossibleMods([button,baseattribute, key, 'parry_all']);

                setAttrs({
                    hexxen: v,
                    rollvaluename: valuename
                });
            });
        });
    });

    on("change:attribute_athletic", function() {
        getAttrs(["attribute_athletic"], function(values) {
            let ath = parseInt(values.attribute_athletic,10)||0;
            setAttrs({                            
                coups_max: ath
            });
          });
    });
    on("change:kno", function() {
        getAttrs(["KNO"], function(values) {
            let kno = parseInt(values.KNO,10)||0;
            setAttrs({                            
                ideas_max: kno
            });
          });
    });
    on("change:attribute_strength change:attribute_willpower change:skill_insensibility", function() {
        getAttrs(["attribute_strength", "attribute_willpower", "skill_insensibility"], function(values) {
            let str = parseInt(values.attribute_strength,10)||0;
            let wil = parseInt(values.attribute_willpower,10)||0;
            let ins = parseInt(values.skill_insensibility, 10)||0;
            let hp = str + wil + 7 + ins;
            setAttrs({                            
                hitpoints_max: hp
            });
          });
    });
    on("change:attribute_senses change:attribute_dexterity", function() {
        getAttrs(["attribute_senses", "attribute_dexterity"], function(values) {
            let sen = parseInt(values.attribute_senses,10)||0;
            let dex = parseInt(values.attribute_dexterity,10)||0;
            let ini = sen + dex;
            setAttrs({                            
                ini: ini
            });
          });
    });

    const skills = {
        'skill_acrobatics':{att: 'attribute_athletic'},
        'skill_alertness':{att: 'attribute_senses'},
        'skill_perception':{att: 'attribute_senses'},
        'skill_firstaid':{att: 'attribute_knowledge'},
        'skill_sleightofhand':{att: 'attribute_dexterity'},
        'skill_mentalpower':{att: 'attribute_willpower'},
        'skill_crafting':{att: 'attribute_dexterity'},
        'skill_stealth':{att: 'attribute_athletic'},
        'skill_countryandpeople':{att: 'attribute_knowledge'},
        'skill_rhetoric':{att: 'attribute_willpower'},
        'skill_flexing':{att: 'attribute_strength'},
        'skill_reflexes':{att: 'attribute_senses'},
        'skill_riding':{att: 'attribute_athletic'},
        'skill_insensibility':{att: 'attribute_strength'},
        'skill_fieldsofknowledge':{att: 'attribute_knowledge'},

        'weapon_punch':{att: 'attribute_athletic'},
        'weapon_dagger':{att: 'attribute_dexterity'},
        'weapon_fencing':{att: 'attribute_athletic'},
        'weapon_swords' :{att: 'attribute_strength'},
        'weapon_scimitar' :{att: 'attribute_strength'},
        'weapon_impact' :{att: 'attribute_strength'},
        'weapon_polearm' :{att: 'attribute_strength'},
        'weapon_lance' :{att: 'attribute_strength'},
        'weapon_sling' :{att: 'attribute_dexterity'},
        'weapon_pistol' :{att: 'attribute_senses'},
        'weapon_crossbow' :{att: 'attribute_senses'},
        'weapon_musket' :{att: 'attribute_senses'},
        'weapon_dodge' :{att: 'attribute_athletic'},
        'weapon_shield' :{att: 'attribute_strength'},
    };
    Object.keys(skills).forEach(skill => {  
        let attributeName = skills[skill].att;   
        on(`change:${skill} change:${attributeName}`, () => {
            getAttrs([skill, attributeName], function(values) {
                let skillValue = parseInt(values[skill],10)||0;
                let attributeValue = parseInt(values[attributeName],10)||0;
                let v = skillValue + attributeValue;
                setAttrs({                            
                    [`${skill}_max`]: v
                });
            });
        });
    });

    on("sheet:opened", function(eventInfo){
    
        setAttrs({
            rollquery: ""
        });
        
    });