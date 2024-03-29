"use strict";
const boxes = document.querySelectorAll('.box');
const totalIds = boxes.length - 1;
const getInactive = (num, inactives, curr) => {
    const zero = Array.from(boxes).findIndex((el) => Array.from(inactives)[0] === el);
    const one = Array.from(boxes).findIndex((el) => Array.from(inactives)[1] === el);
    const asc = [zero, one, curr].sort((a, b) => a - b);
    if (curr === asc[1]) {
        return num === 0 ? asc[2] : asc[0]; //for 1 and 0 for 2
    }
    else if (curr === asc[2]) {
        return num === 0 ? asc[0] : asc[1]; // for 1 and 1 for 2
    }
    else {
        return Array.from(boxes).findIndex((el) => Array.from(inactives)[num] === el);
    }
};
const getPrevOrNext = (count, type) => type === 'p'
    ? count === 0
        ? totalIds
        : count - 1
    : count === totalIds
        ? 0
        : count + 1;
const clickBar = (box) => {
    const current = Array.from(boxes).findIndex((item) => item === box);
    // ADDING ACTIVE TO THE CURRENT BOX
    boxes.forEach((item) => {
        const current = item === box;
        const classList = item.classList;
        if (current && !classList.contains('active')) {
            classList.remove('inactive');
            classList.add('active');
        }
        else if (!current) {
            classList.remove('active');
        }
    });
    // ROTATE VIEW
    const nextId = getPrevOrNext(current, 'n'); // after the active
    const prevId = getPrevOrNext(current, 'p'); // before the active
    const nextSub = getPrevOrNext(nextId, 'n'); // 2 places after active
    const prevSub = getPrevOrNext(prevId, 'p'); // 2 places before active
    const nextSub2 = getPrevOrNext(nextSub, 'n'); // 3 places after active
    const prevSub2 = getPrevOrNext(prevSub, 'p'); // 2 places before active
    const left = nextSub - 7 < 0 ? totalIds + (nextSub - 6) : nextSub - 7; // earliest box THIS WORKS!?
    const right = prevSub + 7 > totalIds ? prevSub + 6 - totalIds : prevSub + 7; // latest box
    const left2 = getPrevOrNext(left, 'p'); // earliest box by 2
    const right2 = getPrevOrNext(right, 'n'); // latest box by 2
    // CLASSLISTS
    const nextMainClassList = boxes[nextId].classList;
    const nextSubClassList = boxes[nextSub].classList;
    const prevMainClassList = boxes[prevId].classList;
    const prevSubClassList = boxes[prevSub].classList;
    // console.log(nextSub2, left2, prevSub2, right2); ==!!
    if (nextMainClassList.contains('inactive')) {
        nextMainClassList.remove('inactive'); // remove 'inactive' from the rightmost bar
        nextSubClassList.remove('none'); // remove 'none' from the invisible bar after that
        nextSubClassList.add('inactive'); // add 'inactive' to it
        boxes[nextSub2].classList.add('none'); // add 'none' to the leftmost inactive bar ==
        boxes[left].classList.add('inactive'); // add 'inactive' to the leftmost bar
        boxes[left2].classList.add('none'); //  add 'none' to the leftmost inactive bar ==
        boxes[left2].classList.remove('inactive'); //  remove 'inactive' to the leftmost inactive bar
    }
    else if (prevMainClassList.contains('inactive')) {
        prevMainClassList.remove('inactive'); // remove 'inactive' from the leftmost bar
        prevSubClassList.remove('none'); // remove 'none' from the invisible bar after that
        prevSubClassList.add('inactive'); // add 'inactive' to it
        boxes[prevSub2].classList.add('none'); // add 'none' to the rightmost inactive bar ==
        boxes[right].classList.add('inactive'); // add 'inactive' to the rightmost bar
        boxes[right2].classList.add('none'); // add 'none' to the rightmost inactive bar ==
        boxes[right2].classList.remove('inactive'); //  remove 'inactive' to the rightmost inactive bar
    }
    // GETTING THE BARS IN VIEW
    const validBars = [];
    const endID = getInactive(0, document.querySelectorAll('.inactive'), current);
    const startID = getInactive(1, document.querySelectorAll('.inactive'), current);
    boxes.forEach((box, id) => {
        const logic = startID < endID
            ? id <= endID && id >= startID
            : id <= endID || id >= startID;
        if (logic)
            validBars.push(box);
    });
    const startElm = boxes[startID];
    const endElm = boxes[endID];
    const startElmID = validBars.indexOf(startElm);
    const endElmID = validBars.indexOf(endElm);
    // if (validBars.indexOf(startElm) === 0) {
    //   console.log('here lol');
    // } else {
    //   // console.log(validBars);
    //   validBars
    //     .sort((a, b) => {
    //       const aID = validBars.indexOf(a);
    //       const bID = validBars.indexOf(b);
    //       console.log(aID, bID);
    //       if (a === startElm) return -1;
    //       if (a === endElm) return 1;
    //       return 0;
    //     })
    //     .forEach((item, id) => (item.style.order = `${id}`));
    // }
    console.log(validBars);
};
const controls = (state) => {
    const current = Array.from(boxes).findIndex((item) => item.classList.contains('active'));
    if (current <= 0) {
        clickBar(boxes[state ? current + 1 : totalIds]);
        return;
    }
    if (current === totalIds && state) {
        clickBar(boxes[0]);
        return;
    }
    clickBar(boxes[state ? current + 1 : current - 1]);
};
// eventlisteners
boxes.forEach((box, id) => {
    box.addEventListener('click', () => clickBar(box));
    // DELETE
    const h3 = box.querySelector('h3');
    h3.textContent = `${id}`;
});
document
    .querySelector('.prev')
    .addEventListener('click', () => controls(false));
document
    .querySelector('.next')
    .addEventListener('click', () => controls(true));
