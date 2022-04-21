import re
import json
from os import listdir

alphabets = "([A-Za-z])"
prefixes = "(Mr|St|Mrs|Ms|Dr)[.]"
suffixes = "(Inc|Ltd|Jr|Sr|Co)"
starters = "(Mr|Mrs|Ms|Dr|He\s|She\s|It\s|They\s|Their\s|Our\s|We\s|But\s|However\s|That\s|This\s|Wherever)"
acronyms = "([A-Z][.][A-Z][.](?:[A-Z][.])?)"
websites = "[.](com|net|org|io|gov)"


def split_into_sentences(text):
    text = " " + text + "  "
    text = text.replace("\n", " ")
    text = re.sub(prefixes, "\\1<prd>", text)
    text = re.sub(websites, "<prd>\\1", text)
    if "Ph.D" in text:
        text = text.replace("Ph.D.", "Ph<prd>D<prd>")
    text = re.sub("\s" + alphabets + "[.] ", " \\1<prd> ", text)
    text = re.sub(acronyms+" "+starters, "\\1<stop> \\2", text)
    text = re.sub(alphabets + "[.]" + alphabets + "[.]" + alphabets + "[.]", "\\1<prd>\\2<prd>\\3<prd>", text)
    text = re.sub(alphabets + "[.]" + alphabets + "[.]", "\\1<prd>\\2<prd>", text)
    text = re.sub(" "+suffixes+"[.] "+starters, " \\1<stop> \\2", text)
    text = re.sub(" "+suffixes+"[.]", " \\1<prd>", text)
    text = re.sub(" " + alphabets + "[.]", " \\1<prd>", text)
    if "”" in text:
        text = text.replace(".”", "”.")
    if "\"" in text:
        text = text.replace(".\"", "\".")
    if "!" in text:
        text = text.replace("!\"", "\"!")
    if "?" in text:
        text = text.replace("?\"", "\"?")
    text = text.replace(".", "<stop>")
    text = text.replace("?", "<stop>")
    text = text.replace("!", "<stop>")
    text = text.replace("<prd>", ".")
    sentences = text.split("<stop>")
    sentences = sentences[:-1]
    sentences = [s.strip() for s in sentences]
    return [i for i in sentences if i]


#  struct [title: "ReefBlower", data:[{character: "plankton", sentences:{name: "name", children: {}, value: 0}}]]
# for s in splits:
#     sentenceWords = add_word_sentence_dict(s, sentenceWords)
#     charListIndex = characterList.index(character)
#     charDictArray[charListIndex]["sentences"] = sentenceWords
def add_word_sentence_dict(sentence, dataArr, speaker):
    words = sentence.split()
    index = None
    charIndex = None
    sentenceDict = None
    # check if first word is root key of a root dict
    add_character = True
    for idx, dicts in enumerate(dataArr):
        if speaker == dicts["character"]:
            charIndex = idx
            add_character = False
            break
    
    if add_character:
        dataArr.append({"character": speaker, "sentences": {"name": speaker+": ", "children": []}})
        sentenceDict = dataArr[len(dataArr) - 1]["sentences"]
    else:
        sentenceDict = dataArr[charIndex]["sentences"]

    add_root = True
    for idx, dicts in enumerate(sentenceDict["children"]):
        if words[0] == dicts["name"]:
            index = idx
            add_root = False
            break

    # add root word
    if add_root:
        sentenceDict["children"].append({"name": words[0], "children": [], "value": 1})
        index = len(sentenceDict["children"]) - 1
    else:
        sentenceDict["children"][index]["value"] += 1

    nested = sentenceDict["children"][index]
    for word in (words[1:]):
        children = nested["children"]
        add_word = True
        index = None
        for idx, dicts in enumerate(children):
            if word == dicts["name"]:
                dicts["value"] += 1
                index = idx
                add_word = False
                break
        if add_word:
            children.append({"name": word, "children": [], "value": 1})
            index = len(children) - 1
        nested = children[index]

    return dataArr


def remove_single_paths(sentenceDict, top=True):
    root = sentenceDict["children"]
    removeList = []
    for idx, path in enumerate(root):
        remove = remove_single_paths(path, False)
        if not top:
            return False if (path["value"] > 1) else True
        if remove:
            removeList.append(idx)
    for item in reversed(removeList):
        root.pop(item)

    return sentenceDict


path = "data\\transcripts\\"
# sentenceWords = {"name": "spongebob", "children": []}
sentenceData = []

for count, file in enumerate(listdir(path)):
    with open(path + file, "r", encoding="utf_8") as f:
        # Create list made up of each line of text
        lines = f.readlines()
        name = file.split('.', 1)[0]

    # Initialize some variables that will be used later
        lineCount = 0
        new_lines = []
        lineCount = 0

        # Strip the newline character
        for line in lines:
            # Do not any lines that are only actions, may remove for later goal
            if ":" not in line:
                continue
            new_line = ''
            for string in line:
                string = string.replace('\n', '')
                new_line += string
            new_lines += [new_line]
            lineCount += 1

        # Remove all actions (text in []'s) from the lines.
        # Might need to undo this if we are going to pursue the second A goal, 
        # but for now it is what it is
        sentences = []
        for idx, line in enumerate(new_lines):
            new_lines[idx] = re.sub('\[.*?\]', '', line)
            sentences.append(new_lines[idx])

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
            charDictArray.append({"character": character})

        sentenceWords = {"title": name, "data": []}
        for sentence in sentences:
            if len(sentence) > 1:
                line = sentence.split(':')
                character = line[0]
                quote = line[1]
                splits = split_into_sentences(quote)
                for s in splits:
                    sentenceWords["data"] = add_word_sentence_dict(s, sentenceWords["data"], character)
        sentenceData.append(sentenceWords)

        if count % 39 == 0:
            print(f'{count/(len(listdir(path))-1) * 100} %')
        # sentenceWords = remove_single_paths(sentenceWords)
    with open("data\\test.json", "w") as jsonf:
        # jsonf.write(json.dumps(sentenceData))
        jsonf.write(json.dumps(sentenceData, separators=(',', ':')))

#     jsonf.write(json.dumps(jsonDump, indent=4))
