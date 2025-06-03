// 需要修改
// English translation file
export default {
    common: {
        calculate: '🧮 Calculate Pet Stats',
        help: '❓ Help',
        close: 'Close',
        level: 'Pet Level',
        currentValue: 'Current',
        baseValue: 'Base',
        growthValue: 'Growth',
        expectedValue: 'Expected',
        characterBonus: 'Character Bonus',
        rating: 'Rating',
        contact: '📝Contact Me',
        language: 'Language'
    },
    
    title: {
        main: '🐾 Lineage W Pet Stats Calculator',
        subtitle: 'Calculate your pet\'s growth potential and rating'
    },
    
    pets: {
        select: 'Select Pet',
        wolf: 'Wolf',
        dog: 'Doberman',
        shepherd: 'Sheepdog',
        hound: 'Beagle',
        wolfDesc: 'Main: HP',
        dogDesc: 'Main: Loyalty (Hit)',
        shepherdDesc: 'Main: Endurance (P.Def)',
        houndDesc: 'Main: Speed (Dodge)'
    },
    
    stats: {
        title: 'Current Attributes',
        warning: '⚠️ Please deduct skill bonus from attribute values',
        endurance: 'Endurance',
        loyalty: 'Loyalty',
        speed: 'Speed',
        aggressiveness: 'Aggressiveness',
        hp: 'HP',
        enduranceDesc: '5pts=1 P.Def',
        loyaltyDesc: '5pts=1 Hit Rate',
        speedDesc: '10pts=1 Dodge',
        aggressivenessDesc: '3pts=1 Attack',
        hpDesc: '1pt=30 HP',
        aggressivenessNote: '※Aggressiveness is fixed at 3, no level up'
    },
    
    results: {
        title: 'Results',
        overallRating: 'Overall Rating',
        attribute: 'Attribute'
    },
    
    ratings: {
        excellent: 'Legendary',
        good: 'Excellent',
        average: 'Good',
        normal: 'Normal',
        poor: 'Below Average',
        bad: 'Poor',
        fixed: 'Fixed',
        godTier: 'God Tier Pet',
        highQuality: 'High Quality Pet',
        normalPet: 'Normal Pet',
        needImprovement: 'Needs Improvement',
        poorQuality: 'Poor Quality'
    },
    
    descriptions: {
        godTier: 'Congratulations! This is a legendary pet with excellent growth stats, worth heavy investment!',
        highQuality: 'This is a high-quality pet with above-average growth. Recommended for continued training.',
        normal: 'This pet\'s growth meets expectations and can be used normally.',
        needImprovement: 'This pet\'s growth is below average. Consider enhancement or finding a better replacement.',
        poor: 'This pet\'s growth is significantly poor. Consider retraining or replacing the pet.'
    },
    
    help: {
        title: '🐾 Help Guide',
        usage: 'How to Use',
        calculation: 'Calculation Logic',
        ratingSystem: 'Rating System',
        
        steps: {
            title: '🚀 Usage Steps',
            step1: 'Select your pet type',
            step2: 'Enter pet level (1-15)',
            step3: 'Enter attribute values (⚠️Please deduct skill bonuses)',
            step4: 'Click calculate button to view rating'
        },
        
        baseData: {
            title: '🎯 Pet Base Data'
        },
        
        calculationPrinciple: {
            title: '🧮 Calculation Logic',
            upgradeRates: 'Upgrade Rates',
            mainStat: 'Main Stat: +1(5%), +2(15%), +3(30%), +4(20%), +5(15%), +6(10%), +7(5%)',
            mainStatExpected: 'Expected: +3.75 per level',
            subStat: 'Sub Stat: +0(15%), +1(50%), +2(30%), +3(5%)',
            subStatExpected: 'Expected: +1.25 per level',
            formula: 'Rating Formula',
            formula1: '1. Calculate Expected Value',
            formula1Desc: 'Expected = Base + (Level-1) × Expected Growth per Level',
            formula2: '2. Calculate Growth Rate',
            formula2Desc: 'Growth Rate = (Current - Base) ÷ (Expected - Base)',
            formula3: '3. Main Stat Weighting',
            formula3Desc: 'Main stat score × 1.5 multiplier'
        },
        
        ratingLevels: {
            title: '🏆 Rating Levels',
            excellent140: 'God tier pet, legendary growth',
            excellent120: 'High quality, recommended for training',
            good105: 'Above expectations, worth training',
            normal100: 'Meets expectations, usable',
            poor85: 'Below average, consider enhancement or replacement',
            bad: 'Significantly poor, recommend retraining',
            
            explanation: '💡 Rating Explanation',
            expected: 'Expected Value (100%): Average growth performance calculated from upgrade probabilities',
            logic: 'Rating Logic: Based on expected values, evaluates pet\'s actual growth relative to theoretical average',
            mainWeight: 'Main Stat Weight: Main stat score × 1.5, emphasizing pet\'s primary characteristic',
            overall: 'Overall Rating: Weighted average of all attributes',
            improvement: '"Below Average": Clear indication that pet needs more investment or replacement',
            
            bonusTitle: '💪 Character Bonus Effects',
            enduranceBonus: 'Endurance: Every 5pts = +1 Physical Defense',
            loyaltyBonus: 'Loyalty: Every 5pts = +1 Hit Rate (Melee/Ranged/Magic)',
            speedBonus: 'Speed: Every 10pts = +1 Dodge (Melee/Ranged)',
            hpBonus: 'HP: Every 1pt = +30 HP',
            aggressivenessBonus: 'Aggressiveness: Affects attack aggressiveness, fixed at 3'
        }
    },
    
    footer: {
        contact: '📝Contact Me',
        contactDesc: 'Have any suggestions or feedback? Welcome to fill out the feedback form!',
        feedbackLink: '🔗 Click to go to feedback form',
        createdBy: 'Created by',
        author: 'Orion',
        lastUpdate: 'Last Update: 2025/06/02 V2.4'
    },
    
    notifications: {
        selectPet: 'Please select a pet first',
        invalidLevel: 'Level must be between 1-15',
        valueToohigh: '{{stat}} value is too high, please check if correct (recommend no more than {{max}})',
        negativeValue: '{{stat}} cannot be negative',
        noAttributes: 'Please enter at least one attribute value (except aggressiveness)',
        calculateComplete: 'Calculation complete!',
        languageChanged: 'Language changed to English'
    },
    
    characterBonus: {
        endurance: 'Physical Defense',
        loyalty: 'Hit Rate',
        speed: 'Dodge',
        hp: 'HP',
        none: 'No Bonus'
    }
}; 