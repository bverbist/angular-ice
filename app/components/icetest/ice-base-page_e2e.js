'use strict';

function IceBasePage() {
    this.selectors = {
    };
    this.elems = {
    };
}

// to be overridden if the browser.baseUrl is too short
IceBasePage.prototype.getBaseRelativePath = function() {
    return '';
};

// to be overridden
// Examples:
//   return element(by.css('[ng-view]'))
//   return this.elems.someElement;
IceBasePage.prototype.getPageContentElement = function() {
    return {};
};

// to be overridden
// Should return the correct 'by' selector based on a string key
IceBasePage.prototype.getSelectorByKey = function(key) {
    return key;
};

// to be overridden
// Should return the correct element based on a string key
IceBasePage.prototype.getElementByKey = function(key) {
    return key;
};

IceBasePage.prototype.goTo = function(relativePath) {
    var url = this.getBaseRelativePath();
    if (typeof relativePath !== 'undefined') {
        url += relativePath;
    }
    browser.get(url);
    return this;
};

IceBasePage.prototype.verifyCurrentUrlEndsWith = function(expectedRelativePath) {
    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + this.getBaseRelativePath() + expectedRelativePath);
    return this;
};

IceBasePage.prototype.verifyPageTextMatches = function(expectedRegex) {
    expect(this.getPageContentElement().getText()).toMatch(expectedRegex);
    return this;
};

IceBasePage.prototype.clearElementAndFillInWith = function(element, content) {
    element.clear();
    element.sendKeys(content);
    return this;
};

IceBasePage.prototype.getSelector = function(keyOrSelector) {
    var selector = keyOrSelector;
    if (typeof keyOrSelector === 'string') {
        selector = this.getSelectorByKey(keyOrSelector);
    }
    return selector;
};

IceBasePage.prototype.getElement = function(keyOrElement) {
    var element = keyOrElement;
    if (typeof keyOrElement === 'string') {
        element = this.getElementByKey(keyOrElement);
    }
    return element;
};

IceBasePage.prototype.verifyElementPresent = function(keyOrSelector, expectedBoolean) {
    expect(browser.isElementPresent(this.getSelector(keyOrSelector))).toBe(expectedBoolean);
    return this;
};

IceBasePage.prototype.verifyElementDisplayed = function(keyOrElement, expectedBoolean) {
    expect(this.getElement(keyOrElement).isDisplayed()).toBe(expectedBoolean);
    return this;
};

IceBasePage.prototype.expectValueOf = function(elementOfTypeInput) {
    return expect(elementOfTypeInput.getAttribute('value'));
};

IceBasePage.prototype.verifyElementValueEquals = function(keyOrElementOfTypeInput, expected) {
    this.expectValueOf(this.getElement(keyOrElementOfTypeInput)).toEqual(expected);
    return this;
};

IceBasePage.prototype.verifyElementValueMatches = function(keyOrElementOfTypeInput, expected) {
    this.expectValueOf(this.getElement(keyOrElementOfTypeInput)).toMatch(expected);
    return this;
};

IceBasePage.prototype.expectTextOf = function(elementNotOfTypeInput) {
    return expect(elementNotOfTypeInput.getText());
};

IceBasePage.prototype.verifyElementTextEquals = function(keyOrElementNotOfTypeInput, expected) {
    this.expectTextOf(this.getElement(keyOrElementNotOfTypeInput)).toEqual(expected);
    return this;
};

IceBasePage.prototype.verifyElementTextMatches = function(keyOrElementNotOfTypeInput, expected) {
    this.expectTextOf(this.getElement(keyOrElementNotOfTypeInput)).toMatch(expected);
    return this;
};

IceBasePage.prototype.verifyElementDisabled = function(keyOrElement, expectedBoolean) {
    var expectDisabled = expect(this.getElement(keyOrElement).getAttribute('disabled'));
    if (expectedBoolean) {
        expectDisabled.toEqual('true');
    } else {
        expectDisabled.toBeNull();
    }
    return this;
};

IceBasePage.prototype.verifyElementChecked = function(keyOrElement, expectedBoolean) {
    var expectChecked = expect(this.getElement(keyOrElement).getAttribute('checked'));
    if (expectedBoolean) {
        expectChecked.toEqual('true');
    } else {
        expectChecked.toBeNull();
    }
    return this;
};

IceBasePage.prototype.verifyElementClassMatches = function(keyOrElement, expected) {
    expect(this.getElement(keyOrElement).getAttribute('class')).toMatch(expected);
    return this;
};

module.exports = IceBasePage;