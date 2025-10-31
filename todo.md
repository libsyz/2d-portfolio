
## Todo 
[] Loading screen
[] Need a background for the main app container
[] I need a new concept for the intro scene
[] How am I going to handle mobile users? 
[] Fix Tutorial Snapshot - should not show the gamepad and wasd instead
[] Dialogue box improvement
   Min
   [X] Word show one by one at decent speed
   [X] Sound plays on loop while they show
   [X] Stop Sound at the end
   [X] At stop, the user can press space to move to the next

   Consider
   [] Add Frame around character head
 
-- Intro Scene -- 

[X] Add fadein function
[X] Have 1 second delay until ninja comes in for drama effect
 
-- House --

--- Forest -- 

[] Layering - When the player passes close to a tree, he should go under it and not over it 
   - But this makes 0 sense because I dont want to have the forest layer as a separate set of objects 
   - So I need to work on the collision detection of the player so it doesn't 'crawl' over vertical things


## Bugs

[X] Game crashes when player tries to open dungeon 
chest but does not have the key yet

[X] Player does not show up on the final game scene

[] Upper corner of the forest is wrong

[X] When the user comes out of a building, the screen should not roll

## Code quality 

[X] ShowDialogueMultiple method is an absolute mess 
[X] Create a factory that manages baddy creation and cleans up the code

[ ] DialogShow should be DialogBubbleShow or something like that

## Nice to haves

[X] Dialogue screens go progressively word by word, megaman style

[] Cast Shadow on characters on main map - Tomorrow morning I do this
   [X] import shadow
   [] create cast shadow component
   [] test on player
   [] Add to all characters on the main map

[X] Bok bok bok sound when chicken speaks - enlightened sound when dark chicken speaks

[] Rain Fx on Forest

[] Fish swimming in beach

[] Baddie should face the player when casting fireball

[] Improve rendering of dialogues to prevent blinking between event/phase changes

[] In the bedroom, it would be cool if you could change colors in the wardrobe and keep it throughout the game 


[] Player Dance/Celebrate animation when scroll is obtained

[] Shuriken particle hit against baddie green demon

[] Screen movement does not follow when the player hits an edge of the village and then immediately reverses direction

[] Limit amount of shurikens to throw, default to swordslash 

[X] Baddies should continue to throw fireballs while user is in range

[] Make scrolls clickable and show actual pixel art scrolls with the content