const stylelint = require('stylelint');

const ruleName = 'custom/no-root-in-modules';
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (selector) => `Unexpected ":root" selector "${selector}" in CSS Module. Global selectors like ":root" are not allowed in CSS Modules. Use global CSS files for CSS custom properties.`,
});

const meta = {
  url: 'https://github.com/css-modules/css-modules#exceptions',
};

/** @type {import('stylelint').Rule} */
const ruleFunction = (primary, secondaryOptions, context) => {
  return (root, result) => {
    const validOptions = stylelint.utils.validateOptions(result, ruleName, {
      actual: primary,
      possible: [true, false],
    });

    if (!validOptions) {
      return;
    }

    if (!primary) {
      return;
    }

    root.walkRules((rule) => {
      // Check if the selector contains :root
      if (rule.selector.includes(':root')) {
        stylelint.utils.report({
          message: messages.rejected(rule.selector),
          node: rule,
          result,
          ruleName,
        });
      }

      // Also check for other global selectors that shouldn't be in modules
      const globalSelectors = [
        /^html\b/,
        /^body\b/,
        /^\*/,
        /^:root/,
        /^@keyframes/
      ];

      globalSelectors.forEach((pattern) => {
        if (pattern.test(rule.selector)) {
          stylelint.utils.report({
            message: `Unexpected global selector "${rule.selector}" in CSS Module. Global selectors should be in regular CSS files, not CSS Modules.`,
            node: rule,
            result,
            ruleName,
          });
        }
      });
    });

    // Also check at-rules for keyframes
    root.walkAtRules('keyframes', (rule) => {
      stylelint.utils.report({
        message: `Unexpected @keyframes "${rule.params}" in CSS Module. Global animations should be defined in regular CSS files.`,
        node: rule,
        result,
        ruleName,
      });
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

module.exports = ruleFunction;