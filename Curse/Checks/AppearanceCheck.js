/** 
 * Function that checks the current appearance of a character to patch in the rule items (curses)
 * IMPORTANT: Returns true if character needs refresh when using something else than an activator 
 */
function AppearanceCheck() {
    var isActivated = !(cursedConfig.mistressIsHere && cursedConfig.disaledOnMistress)
        && (
            (cursedConfig.enabledOnMistress && cursedConfig.ownerIsHere)
            || !cursedConfig.enabledOnMistress
        );
    let r = false;
    if (isActivated) {
        cursedConfig.genericProcs = [];

        //Checks if settings are respected
        //Cursed collar
        if (
            cursedConfig.hasCursedKneel
            && Player.CanKneel()
            && !Player.Pose.includes("Kneel")
        ) {
            SendChat("The cursed collar on " + Player.Name + "'s neck gives her an extreme shock, forcing her to get on her knees.");
            KneelAttempt();
            cursedConfig.strikes++;
        }

        //Cursed Items
        if (cursedConfig.hasCursedBelt && itemIsAllowed("PolishedChastityBelt", "ItemPelvis")) {
            SendChat("The cursed chastity belt on " + Player.Name + " reappears.");
            procGenericItem("PolishedChastityBelt", "ItemPelvis");
            cursedConfig.strikes += 5;
        }

        if (cursedConfig.hasCursedGag && itemIsAllowed("BallGag", "ItemMouth")) {
            SendChat("The cursed gag on " + Player.Name + " reappears.");
            procGenericItem("BallGag", "ItemMouth");
            cursedConfig.strikes += 5;
        }

        if (cursedConfig.hasCursedMittens &&  itemIsAllowed("LeatherMittens", "ItemHands")) {
            SendChat("The cursed mittens on " + Player.Name + " reappear.");
            procGenericItem("LeatherMittens", "ItemHands");
            cursedConfig.strikes += 5;
        }

        if (cursedConfig.hasCursedPaws &&  itemIsAllowed("PawMittens", "ItemHands")) {
            SendChat("The cursed paws on " + Player.Name + " reappear.");
            procGenericItem("PawMittens", "ItemHands");
            cursedConfig.strikes += 5;
        }

        if (cursedConfig.hasCursedBlindfold && itemIsAllowed("FullBlindfold", "ItemHead")) {
            SendChat("The cursed blindfold on " + Player.Name + " reappears.");
            procGenericItem("FullBlindfold", "ItemHead");
            cursedConfig.strikes += 5;
        }

        if (cursedConfig.hasCursedHood &&  itemIsAllowed("LeatherHoodSensDep", "ItemHead")) {
            SendChat("The cursed VR Hood on " + Player.Name + " reappears.");
            procGenericItem("LeatherHoodSensDep", "ItemHead");
            cursedConfig.strikes += 5;
        }

        if (cursedConfig.hasCursedEarplugs && itemIsAllowed("HeavyDutyEarPlugs", "ItemEars")) {
            SendChat("The cursed earplugs on " + Player.Name + " reappear.");
            procGenericItem("HeavyDutyEarPlugs", "ItemEars");
            cursedConfig.strikes += 5;
        }

        if (cursedConfig.hasCursedDildogag && itemIsAllowed("DildoPlugGag", "ItemMouth")) {
            SendChat("The cursed dildo finds its way back into " + Player.Name + "'s mouth.");
            procGenericItem("DildoPlugGag", "ItemMouth");
            cursedConfig.strikes += 5;
        }

        if (cursedConfig.hasCursedPanties && itemIsAllowed("PantyStuffing", "ItemMouth")) {
            SendChat("The cursed panties find their way back into " + Player.Name + "'s mouth .");
            procGenericItem("PantyStuffing", "ItemMouth");
            cursedConfig.strikes += 5;
        }

        if (cursedConfig.hasCursedKneel && itemIsAllowed("HighSecurityCollar", "ItemNeck")) {
            SendChat("The cursed collar on " + Player.Name + " reappears.");
            procGenericItem("HighSecurityCollar", "ItemNeck");
            cursedConfig.strikes += 5;
        }
        
        if (cursedConfig.hasCursedScrews && itemIsAllowed("ScrewClamps", "ItemNipples")) {
            SendChat("The cursed screw clamps on " + Player.Name + " reappear.");
            procGenericItem("ScrewClamps", "ItemNipples");
            cursedConfig.strikes += 5;
        }

        //Generic Cursed Item
        cursedConfig.cursedItems.forEach(({name, group, color}) => {
            if (itemIsAllowed(name, group)) {
                SendChat(`The cursed item on ${Player.Name} reappears. (${name})`);
                procGenericItem(name, group, color);
                cursedConfig.strikes += 3;
            }
        });

        //Locked appearance
        /*cursedConfig.cursedAppearance.forEach(({ name, group, color }) => {
           var item = Player.Appearance.filter(el => el.Asset.Name == name && el.Asset.Group.Name != group && el.Color == color);
           if (item.length == 0) {
               InventoryRemove(Player, group)
               procGenericItem(name, group, color);
           }
        });*/

        //Cursed nakedness
        if (
            cursedConfig.hasCursedNakedness
            && ["Cloth", "ClothLower", "ClothAccessory", "Suit", "SuitLower", "Bra", "Panties", "Socks", "Shoes", "Hat", "Gloves"].filter(item => InventoryGet(Player, item)).length > 0
        ) {
            SendChat("The curse on " + Player.Name + " makes her clothes vanish mysteriously.");
            procCursedNaked();
            cursedConfig.strikes++;
        }

        //Cursed Orgasms
        if (
            cursedConfig.hasCursedOrgasm
            && (
                itemIsAllowed(Player, "ItemButt")
                || itemIsAllowed(Player, "ItemVulva")
                || itemIsAllowed(Player, "ItemNipples")
                || itemIsAllowed(Player, "ItemVulvaPiercings")
                || itemIsAllowed(Player, "ItemNipplesPiercings")
                || (
                    InventoryGet(Player, "ItemButt")
                    && InventoryGet(Player, "ItemButt").Asset.Name == "InflVibeButtPlug"
                    && (!InventoryGet(Player, "ItemButt").Property ||
                        InventoryGet(Player, "ItemButt").Property.Intensity != 4
                        || InventoryGet(Player, "ItemButt").Property.InflateLevel != 4)
                ) || (
                    InventoryGet(Player, "ItemVulva")
                    && InventoryGet(Player, "ItemVulva").Asset.Name == "InflatableVibeDildo"
                    && (!InventoryGet(Player, "ItemVulva").Property || InventoryGet(Player, "ItemVulva").Property.Intensity != 4
                        || InventoryGet(Player, "ItemVulva").Property.InflateLevel != 4)
                ) || (
                    InventoryGet(Player, "ItemNipples")
                    && InventoryGet(Player, "ItemNipples").Asset.Name == "TapedVibeEggs"
                    && (!InventoryGet(Player, "ItemNipples").Property || InventoryGet(Player, "ItemNipples").Property.Intensity != 4)
                ) || (
                    InventoryGet(Player, "ItemVulvaPiercings")
                    && InventoryGet(Player, "ItemVulvaPiercings").Asset.Name == "VibeHeartClitPiercing"
                    && (!InventoryGet(Player, "ItemVulvaPiercings").Property || InventoryGet(Player, "ItemVulvaPiercings").Property.Intensity != 4)
                ) || (
                    InventoryGet(Player, "ItemNipplesPiercings")
                    && InventoryGet(Player, "ItemNipplesPiercings").Asset.Name == "VibeHeartPiercings"
                    && (!InventoryGet(Player, "ItemNipplesPiercings").Property || InventoryGet(Player, "ItemNipplesPiercings").Property.Intensity != 4)
                )
            )) {

            SendChat("The curse on " + Player.Name + " brings the vibrators back to their maximum intensity.");
            procCursedOrgasm();
            cursedConfig.strikes++;
        }

        //Cursed latex
        if (
            cursedConfig.hasCursedLatex
            && (
                itemIsAllowed("SeamlessCatsuit", "Suit")
                || itemIsAllowed("SeamlessCatsuit", "SuitLower")
                || itemIsAllowed("Catsuit", "Gloves")
                || itemIsAllowed("LatexPants1", "ClothLower")
                || itemIsAllowed("ThighHighLatexHeels", "ItemBoots")
                || itemIsAllowed("LatexBallMuzzleGag", "ItemMouth")
                || itemIsAllowed("BoxTieArmbinder", "ItemArms")
                || itemIsAllowed("LatexCorset1", "ItemTorso")
                /*|| itemIsAllowed("CollarShockUnit", "ItemNeckAccessories")*/
            )
        ) {
            SendChat("The cursed latex embraces " + Player.Name + ".");
            procCursedLatex();
            cursedConfig.strikes += 2;
        }

        //Cursed maid
        if (
            cursedConfig.hasCursedMaid
            && (
                itemIsAllowed("MaidOutfit1", "Cloth")
                || itemIsAllowed("MaidHairband1", "Hat")
            )
        ) {
            SendChat("The curse keeps " + Player.Name + " as a maid.");
            procCursedMaid();
            cursedConfig.strikes += 2;
        }
        
        //Cursed pony
        if (
            cursedConfig.hasCursedPony
            && (itemIsAllowed("SeamlessCatsuit", "Suit")
                || itemIsAllowed("SeamlessCatsuit", "SuitLower")
                || itemIsAllowed("Catsuit", "Gloves")
                || itemIsAllowed("PonyBoots", "ItemBoots")
                || itemIsAllowed("HarnessPonyBits", "ItemMouth")
                || itemIsAllowed("ArmbinderJacket", "ItemArms")
                || itemIsAllowed("LeatherLegCuffs", "ItemLegs")
                || itemIsAllowed("LatexCorset1", "ItemTorso")
                /*|| itemIsAllowed("CollarShockUnit", "ItemNeckAccessories")*/
            )) {
            SendChat("The curse keeps " + Player.Name + " as a pony.");
            procCursedPony();
            cursedConfig.strikes += 2;
        }

        //Cursed ropes
        if (
            cursedConfig.hasCursedRopes
            && (
                itemIsAllowed("HempRope", "ItemArms")
                || itemIsAllowed("HempRope", "ItemLegs")
                || itemIsAllowed("HempRope", "ItemFeet")
            )
        ) {
            SendChat(`The cursed ropes embrace ${Player.Name}.`);
            procCursedRopes();
            cursedConfig.strikes += 2;
        }

    }
    return r;
}