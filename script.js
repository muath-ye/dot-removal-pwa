// Mapping of Arabic letters with dots to their dot-less or desired counterparts
const mapping = {
    'أ': 'ا',
    'إ': 'ا',
    'ء': 'ء',
    'ئ': 'ء',
    'ب': 'ٮ',
    'ت': 'ٮ',
    'ث': 'ٮ',
    'ج': 'ح',
    'ح': 'ح',
    'خ': 'ح',
    'د': 'د',
    'ذ': 'د',
    'ر': 'ر',
    'ز': 'ر',
    'س': 'س',
    'ش': 'س',
    'ص': 'ص',
    'ض': 'ص',
    'ط': 'ط',
    'ظ': 'ط',
    'ع': 'ع',
    'غ': 'ع',
    'ف': 'ڡ',
    'ق': 'ٯ',
    'ك': 'ك',
    'ل': 'ل',
    'م': 'م',
    'ن': 'ٮ', // Default mapping for 'ن'
    'ه': 'ه',
    'و': 'و',
    'ي': 'ٮ', // Default mapping for 'ي'
    'ى': 'ى'  // Final yā remains unchanged
};

// Regular expression to match Arabic diacritics (Tashkeel)
const tashkeelRegex = /[\u064B-\u0652]/g;

// Function to remove diacritics
function removeTashkeel(text) {
    return text.replace(tashkeelRegex, '');
}

// Helper function to check if a character is a diacritic
function isTashkeel(char) {
    return tashkeelRegex.test(char);
}

// Function to remove dots based on the mapping and letter positions
function removeDots(text) {
    // Split the text into words and non-word characters (like spaces and punctuation)
    const tokens = text.split(/(\s+|[.,!?؛،])/g);
    
    // Process each token
    const processedTokens = tokens.map(token => {
        // If the token is a word (contains Arabic letters), process it
        if (/[\u0600-\u06FF]/.test(token)) {
            const chars = Array.from(token);
            const len = chars.length;
            let result = '';
            for (let i = 0; i < len; i++) {
                const char = chars[i];
                
                // Skip diacritics
                if (isTashkeel(char)) {
                    continue;
                }

                // Handle 'ن' and 'ي' based on their position
                if (char === 'ن') {
                    // Determine if 'ن' is at the end of the word, ignoring any diacritics that follow
                    let j = i + 1;
                    let isEnd = true;
                    while (j < len) {
                        if (!isTashkeel(chars[j])) {
                            isEnd = false;
                            break;
                        }
                        j++;
                    }
                    if (isEnd) {
                        result += 'ں'; // End of word
                    } else {
                        result += 'ٮ'; // Middle of word
                    }
                } else if (char === 'ي') {
                    // Similar handling for 'ي'
                    let j = i + 1;
                    let isEnd = true;
                    while (j < len) {
                        if (!isTashkeel(chars[j])) {
                            isEnd = false;
                            break;
                        }
                        j++;
                    }
                    if (isEnd) {
                        result += 'ى'; // End of word
                    } else {
                        result += 'ٮ'; // Middle of word
                    }
                } else {
                    // Replace other characters based on the mapping
                    result += mapping[char] ? mapping[char] : char;
                }
            }
            return result;
        } else {
            // If not a word, return the token as is (spaces, punctuation, etc.)
            return token;
        }
    });
    
    // Reassemble the processed tokens into a single string
    return processedTokens.join('');
}

// Function to process the text based on user options
function processText() {
    const inputText = document.getElementById('inputText').value;
    const removeTashkeelOption = document.getElementById('removeTashkeel').checked;
    
    let outputText = removeDots(inputText);
    
    if (removeTashkeelOption) {
        outputText = removeTashkeel(outputText);
    }
    
    document.getElementById('outputText').value = outputText;
}

// Event listener for the process button
document.getElementById('processTextBtn').addEventListener('click', processText);
