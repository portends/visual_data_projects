# Sandy: It sure was a humdinger of an argument!
# Karen: She went bananas and vowed to destroy any and all the Gal Pals.
# Mrs. Puff: Then she just ran off into these woods!
# Sandy: Some say she's still out there, all hot-headed and waiting to get her revenge.
# Karen: That's her pendant you're wearing.
# Pearl:  "Flibberty Gibbet"?!  Why did you give me that? Why did you take me here?!  Thanks, gals, you got me. But I knew you were gonna prank me.
# Karen: Sure you did.
# Mrs. Puff: You should have seen your face.
# Sandy: We got you good!

# ['Mrs. Puff', 'Sandy, Karen, and Mrs. Puff', 'Karen', 'Sandy', 'Pearl', 'SpongeBob', 'Sandy, Karen, Mrs. Puff, and Pearl', 'Flibberty Gibbet']

string1 = 'sandy: Now is the time for all good men to come to the aid of their country'

characterList = ['mrs. puff', 'sandy, karen, and mrs. puff', 'karen', 'sandy', 'pearl', 'spongebob', 'sandy, karen, mrs. puff, and pearl', 'flibberty gibbet']
charDictArray = []

for character in characterList:
    charDict = {}
    charDictArray += [charDict]

string1 = string1.lower()
string1 = string1.split(':')

quote = string1[1].split()

for word in quote:
    if word not in charDictArray[3]:
        charDictArray[3][word] = 1
    elif word in charDictArray[3]:
        charDictArray[3][word] += 1

print(string1)
print(quote)

print(charDictArray)

# thisdict = {}
# thisdict['spongebob'] = 0
# thisdict['mr. krabs'] = 0

# thisdict['mr. krabs'] += 1

# print(thisdict)