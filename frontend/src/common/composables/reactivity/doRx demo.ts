import { ref } from "vue"
import { doRx } from "./doRx"

// @example
const str = doRx('1')
const bool = doRx(false)
const test = doRx<number, string>(0, {
  adapter: (incoming) => {
    (incoming as string)
    return 3
  }
})
test.adapt('2')
test.adapt(false)


// @example
// Create a ref with a setter that transform strings to numbers
const multiply = doRx(0, {
  adapter: (incoming) => incoming * 2
});


// @example
// Providing an initial value
const alwaysString = doRx("initial");
console.log(alwaysString.value); // "initial"


// @example
// Create a ref with a setter that transform strings to numbers
const numbersOnly = doRx<number, string>(0, {
  adapter: (incoming) => Number(incoming)
});
numbersOnly.value = "2"; // Reporting type incompatibility
numbersOnly.adapt("2"); // Parameter type is allowed and adapt will transform it to number


// @example
// Create a ref that only accepts positive numbers
const positiveNum = doRx(0, {
  filter: (incoming) => typeof incoming === 'number' && incoming > 0 || false
});


// @example
// Subscribe to a source with a transformation
const source = ref(10);
positiveNum.subscribe([source], (incoming, { ref }) => ref.value = (incoming * 2));
