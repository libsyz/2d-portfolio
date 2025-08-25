
## Todo 

[] I need a new concept for the intro scene
[] How am I going to handle mobile users? 
[] Fix Tutorial - should not show the gamepad

-- Intro Scene -- 

[X] Add fadein function
[X] Have 1 second delay until ninja comes in for drama effect
 
-- House --

[X] Player should not be able to shoot in the bedroom
[X] need to improve bounds
[X] Apartment house background is white - should be the same color as the rest of the scenario 
[X] Game Crashes when player interacts with tarifa painting
[X] Elias should stop the patrol when in touch with the player
[ ] Shader/Shine/Blink on items of interest

-- Village --

[X] Improve Chicken Behavior - Add the same Patrol Component as Elias 
[X] Should not be able to throw Shurikens when talking to the old man

-- Beach -- 

[x] fisherman dialogue needs to be superimposed - z 9999 or something like that
[x] Floor looks bad - either make a proper degradation or make it all sand
[x] Should not throw shurikens when talking to the fisherman

--- Forest -- 

[] Layering - When the player passes close to a tree, he should go under it and not over it 
   - But this makes 0 sense because I dont want to have the forest layer as a separate set of objects 
   - So I need to work on the collision detection of the player so it doesn't 'crawl' over vertical things

[X] Player should not be able to move for a bit when hit by fireball

-- Cave -- 

[] When the player tries to open the chest and he does not have a key, a dialog should inform the user  

## Bugs

[] Game not finishing when all scrolls are obtained 

[] Lightining scroll does not disappear when obtained

[] Upper corner of the forest is wrong

[] When the user comes out of a building, the screen should not roll

## Code quality 

[ ] ShowDialogueMultiple method is an absolute mess 
[X] Create a factory that manages baddy creation and cleans up the code

[ ] DialogShow should be DialogBubbleShow or something like that

## Nice to haves

[] Baddie should face the player when casting fireball

[] Improve rendering of dialogues to prevent blinking between event/phase changes

[] In the bedroom, it would be cool if you could change colors in the wardrobe and keep it throughout the game 

[] Add Coworkers talking to one another on the coffee area of the office

[] Player Dance/Celebrate animation when scroll is obtained
[] Shurikens hit against boundaries
[] Screen movement does not follow when the player hits an edge of the village and then immediately reverses direction

[] Limit amount of shurikens to throw, default to swordslash 
[] Baddies should continue to throw fireballs while user is in range
[] Make scrolls clickable and show actual pixel art scrolls with the content