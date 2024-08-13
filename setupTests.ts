// setupTests.ts

// Import jest-dom's custom matchers to extend expect
import '@testing-library/jest-dom';

if (typeof window !== 'undefined') {
  window.matchMedia =
    window.matchMedia ||
    function () {
      return {
        matches: false,
        addListener: function () {},
        removeListener: function () {},
      };
    };
}
