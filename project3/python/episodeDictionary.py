import re

# Open the file to be read for data
# TODO: Change hardcoded value to a dynamic variable received from looping through episode list
file1 = open(r"data\\transcripts\\ACabinintheKelp.txt","r")

# Create list made up of each line of text
lines = file1.readlines()

# Initialize some variables that will be used later
lineCount = 0
new_lines = []
lineCount = 0

# Strip the newline character
for line in lines:
    new_line = ''
    for string in line:
        string = string.replace('\n', '')
        new_line += string
    new_lines += [new_line]
    lineCount += 1

# Remove all actions (text in []'s) from the lines.
# Might need to undo this if we are going to pursue the second A goal, 
# but for now it is what it is
lineCount = 0
for line in new_lines:
    new_lines[lineCount] = re.sub('\[.*?\]', '', line)
    new_lines[lineCount] = new_lines[lineCount].lower()
    lineCount += 1

# Loop through each line of the script
# In each line, check if who is currently speaking is in list
# if not, add to the list
# then create a dictionary for each character in the list
characterList = []
for line in new_lines:
    # Split each line in two; the character speaking and their dialogue
    line = line.split(':')

    if len(line) > 1:
        if line[0] not in characterList:
            characterList += [line[0]]

# Initialize array of empty dictionaries for each character
charDictArray = []
for character in characterList:
    charDict = {}
    charDictArray += [charDict]

# Loop through each line of dialogue 
for line in new_lines:
    # Split each line in two; the character speaking and their dialogue, then create separate variables for each
    if len(line) > 1:
        line = line.split(':')
        character = line[0]
        quote = line[1]

        # remove punctuation, then split the quote into a list of individual words
        quote = re.sub(r'[^\w\s]','',quote)
        quote = quote.split()

        # create index value for assigning to the charDictArray
        charListIndex = characterList.index(character)
        
        # Add words in the quote to the character's dictionary
        # if word doesn't exist, create it with inital value of 1
        # else if it does exist, increment
        # TODO: maybe add an else saying an error occurred? idk
        for word in quote:
            if word not in charDictArray[charListIndex]:
                charDictArray[charListIndex][word] = 1
            elif word in charDictArray[3]:
                charDictArray[charListIndex][word] += 1

# create a final dictionary object, with each character and each word/count dictionary
dictExport = {}
for character in characterList:
    charListIndex = characterList.index(character)
    dictExport[character] = charDictArray[charListIndex]

print(dictExport)

file1.close()