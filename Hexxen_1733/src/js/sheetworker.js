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
            rollvaluename: '',
            rollattribute: '',
            rollmodifiers: ''
        });
    });
   
    const checklist = [
    'attribute_strength',
     'attribute_athletic',
      'attribute_dexterity',
       'attribute_senses',
        'attribute_knowledge',
        'attribute_willpower',
     'skill_acrobatics',
        'skill_alertness',
        'skill_perception',
        'skill_firstaid',
        'skill_sleightofhand',
        'skill_mentalpower',
        'skill_crafting',
        'skill_stealth',
        'skill_countryandpeople',
        'skill_rhetoric',
        'skill_flexing',
        'skill_reflexes',
        'skill_riding',
        'skill_insensibility',
        'skill_fieldsofknowledge',
        'weapon_punch',
        'weapon_dagger',
        'weapon_fencing',
        'weapon_swords',
        'weapon_scimitar',
        'weapon_impact',
        'weapon_polearm',
        'weapon_lance',
        'weapon_sling',
        'weapon_pistol',
        'weapon_crossbow',
        'weapon_musket',
        'weapon_dodge',
        'weapon_shield',
        'parry_weapon_punch',
        'parry_weapon_dagger',
        'parry_weapon_fencing',
        'parry_weapon_swords',
        'parry_weapon_scimitar',
        'parry_weapon_impact',
        'parry_weapon_polearm',
        'parry_weapon_lance',
        'parry_weapon_sling',
        'parry_weapon_pistol',
        'parry_weapon_crossbow',
        'parry_weapon_musket',
        'parry_weapon_dodge',
        'parry_weapon_shield'];
        checklist.forEach(checkname => {
        on(`clicked:${checkname}`, function() {
                
            let valuename = "???";
            let baseattributename = "???"; 
            var checkmax = checkname+"_max";
            if(checkname.startsWith('attribute_'))
            {
                baseattributename = checkname;
                checkmax = checkname;
                valuename = getTranslationByKey(checkname);
            }
           else if(checkname.startsWith('parry_'))
           {
            var checkmax = checkname.replace("parry_", "")+"_max";
            baseattributename = skills[checkname.replace("parry_", "")].att; ;
               valuename = getTranslationByKey(checkname.replace("parry_", ""))+" (Parry)";
           }
          else
            {               
                baseattributename = skills[checkname].att; 
                valuename = getTranslationByKey(checkname)+"["+getTranslationByKey(baseattributename+"_short")+"]";
            }
            
            var checkmod = checkname+"_mod";
            var checkmoddesc = checkname+"_mod_desc";
            console.log(valuename);
            console.log(baseattributename);
            console.log(checkmax);
            console.log(checkmod);
            console.log(checkmoddesc);

            getAttrs([checkmax, checkmod, checkmoddesc], function(values) {
                let v = parseInt(values[checkmax],10)||0;
                var modstring = values[checkmoddesc]||"";
                var janus = parseInt(values[checkmod],10)||0;

                setAttrs({
                    hexxen: v,
                    janus: janus,
                    rollvaluename: valuename,
                    rollattribute: baseattributename,
                    rollmodifiers: modstring
                });
            });
        });
    });

    const parrylist = [
        'parry_weapon_punch',
        'parry_weapon_dagger',
        'parry_weapon_fencing',
        'parry_weapon_swords',
        'parry_weapon_scimitar',
        'parry_weapon_impact',
        'parry_weapon_polearm',
        'parry_weapon_lance',
        'parry_weapon_sling',
        'parry_weapon_pistol',
        'parry_weapon_crossbow',
        'parry_weapon_musket',
        'parry_weapon_dodge',
        'parry_weapon_shield'];

   

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
    on("change:attribute_strength change:attribute_willpower change:skill_insensibility change:hitpoints_mod", function() {
        getAttrs(["attribute_strength", "attribute_willpower", "skill_insensibility","hitpoints_mod" ], function(values) {
            let str = parseInt(values.attribute_strength,10)||0;
            let wil = parseInt(values.attribute_willpower,10)||0;
            let ins = parseInt(values.skill_insensibility, 10)||0;
            let hp_mod = parseInt(values.hitpoints_mod, 10)||0;
            let hp = str + wil + 7 + ins + hp_mod;
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

    on("change:repeating_effects", function(){
        rebuildMods();
    });
    on("remove:repeating_effects", function(eventInfo){
        
        rebuildMods();
    });

    var rebuildMods = function() {
        console.log("rebuild mods");
        var mods = {};
        clearMods(mods);
        var itemfields = [];
        getSectionIDs("repeating_effects", function(idarray) {

            _.each(idarray, function(currentID, i) {
                itemfields.push("repeating_effects_" + currentID + "_name");
                itemfields.push("repeating_effects_" + currentID + "_source");
                itemfields.push("repeating_effects_" + currentID + "_target");
                itemfields.push("repeating_effects_" + currentID + "_bonus");
            });
            getAttrs(itemfields, function(v) {
                _.each(idarray, function(currentID) {
                    
                    var target = v["repeating_effects_" + currentID + "_target"];
                    
                    var modname = v["repeating_effects_" + currentID + "_name"];
                    var bonus = parseInt(v["repeating_effects_" + currentID + "_bonus"],10);
                    addToMods(modname, target, bonus, mods);
                        
                });
                applyParryAll(mods);
                applyParryToWeapons(mods);
                console.log(mods);

                var update = createUpdateListFromMods(mods);
                console.log(update);
                setAttrs(update);
            });
         });
    };
    var applyParryAll = function(mods) {
        if (mods.hasOwnProperty('parry_all')) {
            //add parry_all to all parry_...
            _.each(parrylist, function (parryitem) {
                _.each(mods['parry_all'], function (parryallmod) {
                    addToMods(parryallmod.modname, parryitem, parryallmod.bonus, mods);
                });
    
            });
        }
    };
    var applyParryToWeapons = function(mods) {
        _.each(parrylist, function (parryitem) {
            var weaponname = parryitem.replace("parry_", "");
            if(mods.hasOwnProperty(weaponname))
            {
                _.each(mods[weaponname], function (weaponmod) {
                    addToMods(weaponmod.modname, parryitem, weaponmod.bonus, mods);
                });
            }
        });       
    };
    var clearMods = function(mods) {
        _.each(checklist, function (checkitem) {
            mods[checkitem] = [];
        });
        mods["hitpoints"] = [];
        mods["parry_all"] = [];
    };
    var addToMods = function(modname, target, bonus, mods) {
        if(!mods.hasOwnProperty(target))
            mods[target] = [];

        mods[target].push({modname: modname, bonus: bonus});
    };
    var createUpdateListFromMods = function(mods){
        var update = {};
        Object.entries(mods).forEach(([target,v]) => {
            var modnames = [];
            var bonus_sum = 0;
            _.each(v, function(mod){
                var bonus = mod.bonus;
                bonus_sum += bonus;
                var bonusstring = bonus.toString();
                if(bonus > 0)
                    bonusstring = "+"+bonusstring;
                modnames.push(mod.modname + " "+bonusstring);
            });                  

            update[target+"_mod"] = bonus_sum;
            update[target+"_mod_desc"] = modnames.join(", ")||"";
        });
        return update;
    };

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


