
## Todo 

-- 

-- Final Screen --

[X] Jutsu Animation when Miguel releases the scrolls
[ ] Shock animation when the Shogun sees the scrolls
[ ] Everyone dances when the Shogun welcomes Miguel to the Co

-- Thank you for playing Screen -- 
[ ] Concept 
 - Very similar to start screen, no complications
 - 3 options:
    - Contact miguel
    - See Full CV on Notion
    - Play Again


-- Scroll Capture --

[X] Add success dance move when scroll is obtained
[ ] Add effect? ( i.e. thunder around character when thunder scroll obtained? )


-- House --

--- Forest -- 

[] Layering - When the player passes close to a tree, he should go under it and not over it 
   - But this makes 0 sense because I dont want to have the forest layer as a separate set of objects 
   - So I need to work on the collision detection of the player so it doesn't 'crawl' over vertical things

-


## Bugs

[ ] Player z is above clouds! 
[ ] Spawn points for clouds seem like it's coming out of nowhere 

[X] Game crashes when player tries to open dungeon 
chest but does not have the key yet

[ ] Player is able to move when opening a chest on the dungeon!


[] Upper corner of the forest is wrong


## Code quality 

[X] ShowDialogueMultiple method is an absolute mess 
[X] Create a factory that manages baddy creation and cleans up the code

[ ] DialogShow should be DialogBubbleShow or something like that

## Nice to haves

[] Rain Fx on Forest

[] Fish swimming in beach

[] Baddie should face the player when casting fireball

[] Improve rendering of dialogues to prevent blinking between event/phase changes

[] In the bedroom, it would be cool if you could change colors in the wardrobe and keep it throughout the game 

[] Player Dance/Celebrate animaetion when scroll is obtained

[] Shuriken particle hit against baddie green demon

[] Screen movement does not follow when the player hits an edge of the village and then immediately reverses direction

[] Limit amount of shurikens to throw, default to swordslash 

[X] Baddies should continue to throw fireballs while user is in range

[] Make scrolls clickable and show actual pixel art scrolls with the content