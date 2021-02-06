const buttonlist = ["character","combat","npc","configuration"];
    buttonlist.forEach(button => {
        on(`clicked:${button}`, function() {
            getAttrs(["npc"], function(values) {
                var npc = parseInt(values["npc"],10)||0;
                if(button === "npc")
                    npc = 1;
                else if(button === "character")
                    npc = 0;
                setAttrs({
                    sheetTab: button,
                    npc: npc
                });
            });
        });
    });
    const convertbuttonlist = ["converttopc","converttonpc"];
    convertbuttonlist.forEach(button => {
        on(`clicked:${button}`, function() {
            getAttrs(["npc"], function(values) {
                var npc = 0;
                if(button === "converttonpc")
                    npc = 1;
                else if(button === "converttopc")
                    npc = 0;
                setAttrs({
                    sheetTab: "configuration",
                    npc: npc
                });
            });
        });
    });

    on(`clicked:toggleeditmode`, function() {
        getAttrs(["editmode"], function(values) {
            var editmode = parseInt(values["editmode"],10)||0;

            setAttrs({
                editmode: editmode == 1 ? 0 : 1
            });
        });
    });

    const resourcebuttonlist = ["addcoup","remcoup",
    "addidea","remidea",
    "addblessing","remblessing",
    "addrage","remrage",
    "addambition","remambition",
    "addhex","remhex",
    "addquintessence","remquintessence"];
    resourcebuttonlist.forEach(button => {
        on(`clicked:${button}`, function() {
            var action = button.substr(0,3);
            var ressource = button.substr(3);
            getAttrs([ressource], function(values) {
                let resourceValue = parseInt(values[ressource],10)||0;
                if(action == "add")
                    resourceValue = resourceValue + 1;
                else if(action == "rem")
                    resourceValue = resourceValue -1;
                resourceValue =  Math.min(Math.max(resourceValue, 0), 20);

                var update = {};

                if(resourceValue > 0)
                {
                    if(ressource == "rage")
                        update["ambition"] = 0;
                    else if(ressource == "ambition")
                        update["rage"] = 0;
                }


                
                update[ressource] = resourceValue;
                setAttrs(update);
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
            if(janusValue > 0)
            {
                for (i = 1; i <= janusValue; i++) {
                    query = query + " {{janus"+i+"=[[d6cs>4cf]]}}";
                }
            }
            else if(janusValue < 0)
            {
                for (i = -1; i >= janusValue; i--) {
                    query = query + " {{janus"+i+"=[[d6cs>4cf]]}}";
                }
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


    on("clicked:repeating_npcattacks:rollnpcattack", function(eventInfo) {
        
        const rowid = eventInfo.sourceAttribute.split('_')[2];
        getAttrs([`repeating_npcattacks_${rowid}_name`, `repeating_npcattacks_${rowid}_attribute`, `repeating_npcattacks_${rowid}_attackvalue`], function(attack) {

           

            let valuename =  attack[`repeating_npcattacks_${rowid}_name`];
            let baseattributename = attack[`repeating_npcattacks_${rowid}_attribute`]; 
            let v = parseInt( attack[`repeating_npcattacks_${rowid}_attackvalue`],10)||0;
            var modstring = "";

            setAttrs({
                hexxen: v,
                janus: 0,
                rollvaluename: valuename,
                rollattribute: baseattributename,
                rollmodifiers: modstring
            });  
          
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
        'skill_witchcraft',
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
               valuename = getTranslationByKey(checkname.replace("parry_", ""))+" ("+getTranslationByKey('parry')+")"+" ["+getTranslationByKey(baseattributename+"_short")+"]";
           }
          else
            {               
                baseattributename = skills[checkname].att; 
                valuename = getTranslationByKey(checkname)+" ["+getTranslationByKey(baseattributename+"_short")+"]";
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

   

    on("change:attribute_athletic change:coup_mod", function() {
        getAttrs(["attribute_athletic", "coup_mod"], function(values) {
            var ath = parseInt(values.attribute_athletic,10)||0;
            var coup_mod = parseInt(values.coup_mod,10)||0;
            var coup = ath + coup_mod;
            setAttrs({                            
                coup_max: coup
            });
          });
    });
    on("change:attribute_knowledge change:idea_mod", function() {
        getAttrs(["attribute_knowledge", "idea_mod"], function(values) {
            var kno = parseInt(values.attribute_knowledge,10)||0;
            var idea_mod = parseInt(values.idea_mod,10)||0;
            var idea = kno + idea_mod;
            setAttrs({                            
                idea_max: idea
            });
          });
    });
    on("change:armor", function() {
        getAttrs(["armor"], function(values) {
            let armor = parseInt(values.armor,10)||0;
            let ap_max = 6 - armor;
            setAttrs({                            
                ap_max: ap_max
            });
          });
    });
    on("change:ap", function() {
        getAttrs(["ap", "ap_max"], function(values) {
            let ap = parseInt(values.ap,10)||0;
            let ap_max = parseInt(values.ap_max,10)||0;
            if(ap > ap_max)
            {
                setAttrs({                            
                    ap: ap_max
                });
            }
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
    on("change:attribute_senses change:attribute_dexterity change:skill_reflexes change:ini_mod", function() {
        getAttrs(["attribute_senses", "attribute_dexterity", "skill_reflexes", "ini_mod"], function(values) {
            let sen = parseInt(values.attribute_senses,10)||0;
            let dex = parseInt(values.attribute_dexterity,10)||0;
            let reflexes = parseInt(values.skill_reflexes,10)||0;
            let ini_mod = parseInt(values.ini_mod, 10)||0;
            let ini = sen + dex + reflexes + ini_mod;
            setAttrs({                            
                ini: ini
            });
          });
    });

    on("clicked:addeffect", () => {
        var newrowid = generateRowID();
        var itemfields = {};
        itemfields["repeating_effects_" + newrowid + "_name"] = "Effect name";
        itemfields["repeating_effects_" + newrowid + "_source"] = "effect source";
        itemfields["repeating_effects_" + newrowid + "_target"] = "hitpoints";
        itemfields["repeating_effects_" + newrowid + "_bonus"] = "1";
        setAttrs(itemfields);
    });

    on("change:motivation_name change:motivation_target change:motivation_bonus", function(){
        rebuildMods();
    });
    on("change:repeating_armorsets change:repeating_effects change:repeating_powers change:repeating_hunterpowers", function(){
        rebuildMods();
    });
    on("remove:repeating_armorsets remove:repeating_effects remove:repeating_powers remove:repeating_hunterpowers", function(eventInfo){   
        rebuildMods();
    });

    var rebuildMods = function() {
        console.log("rebuild mods");
        var mods = {};
        clearMods(mods);
        crawlSingleEffect("motivation", mods, function(mods) {
            crawlEffects("repeating_armorsets", mods, function(mods) {
                crawlEffects("repeating_powers", mods, function(mods) {
                    crawlEffects("repeating_hunterpowers", mods, function(mods) {
                        crawlEffects("repeating_effects", mods, function(mods) {
                            finishRebuildMods(mods);
                        });
                    });
                });
            });
        });

    };

    var crawlEffects = function(fieldsetname, mods, callback) {
        var itemfields = [];
        getSectionIDs(fieldsetname, function(idarray) {

            _.each(idarray, function(currentID, i) {
                itemfields.push(fieldsetname+"_" + currentID + "_name");
                itemfields.push(fieldsetname+"_" + currentID + "_target");
                itemfields.push(fieldsetname+"_" + currentID + "_bonus");
            });
            getAttrs(itemfields, function(v) {
                _.each(idarray, function(currentID) {
                    
                    var target = v[fieldsetname+"_" + currentID + "_target"];
                    var modname = v[fieldsetname+"_" + currentID + "_name"];
                    var bonus = parseInt(v[fieldsetname+"_" + currentID + "_bonus"],10);
                    addToMods(modname, target, bonus, mods);
                        
                });
                callback(mods);
                
            });
         });
    }

    var crawlSingleEffect = function(prefix, mods, callback) {
        console.log("Crawl single effect");
        var itemfields = [];
        itemfields.push(prefix+"_name");
        itemfields.push(prefix+"_target");
        itemfields.push(prefix+"_bonus");
        
        getAttrs(itemfields, function(v) {
            
            console.log(itemfields);
            console.log(v);
            var target = v[prefix + "_target"];
            var modname = v[prefix + "_name"];
            var bonus = parseInt(v[prefix + "_bonus"],10);
            addToMods(modname, target, bonus, mods);
            console.log("mods after crawl single effect:");
            console.log(mods);
            callback(mods);
            
        });

    }

    var finishRebuildMods = function(mods) {
        console.log("Finish rebuild mods");
        applyParryAll(mods);
        applyParryToWeapons(mods);
        console.log(mods);

        var update = createUpdateListFromMods(mods);
        console.log(update);
        setAttrs(update);
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
        mods["ini"] = [];
        mods["parry_all"] = [];
        mods["idea"] = [];
        mods["coup"] = [];
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
        'skill_witchcraft':{att: 'attribute_knowledge'},

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
        
    });


