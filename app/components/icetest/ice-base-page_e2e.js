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

IceBasePage.prototype.expectElementPresentOf = function(selector) {
    return expect(browser.isElementPresent(selector));
};

IceBasePage.prototype.expectDisplayedOf = function(element) {
    return expect(element.isDisplayed());
};

IceBasePage.prototype.expectValueOf = function(elementOfTypeInput) {
    return expect(elementOfTypeInput.getAttribute('value'));
};

IceBasePage.prototype.expectTextOf = function(elementNotOfTypeInput) {
    return expect(elementNotOfTypeInput.getText());
};

IceBasePage.prototype.expectDisabledOf = function(element) {
    return expect(element.getAttribute('disabled'));
};

IceBasePage.prototype.expectCheckedOf = function(element) {
    return expect(element.getAttribute('checked'));
};

IceBasePage.prototype.expectClassOf = function(element) {
    return expect(element.getAttribute('class'));
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
    this.expectElementPresentOf(this.getSelector(keyOrSelector)).toBe(expectedBoolean);
    return this;
};

IceBasePage.prototype.verifyElementDisplayed = function(keyOrElement, expectedBoolean) {
    this.expectDisplayedOf(this.getElement(keyOrElement)).toBe(expectedBoolean);
    return this;
};

IceBasePage.prototype.verifyElementValueEquals = function(keyOrElementOfTypeInput, expected) {
    this.expectValueOf(this.getElement(keyOrElementOfTypeInput)).toEqual(expected);
    return this;
};

IceBasePage.prototype.verifyElementValueMatches = function(keyOrElementOfTypeInput, expected) {
    this.expectValueOf(this.getElement(keyOrElementOfTypeInput)).toMatch(expected);
    return this;
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
    if (expectedBoolean) {
        this.expectDisabledOf(this.getElement(keyOrElement)).toEqual('true');
    } else {
        this.expectDisabledOf(this.getElement(keyOrElement)).toBeNull();
    }
    return this;
};

IceBasePage.prototype.verifyElementChecked = function(keyOrElement, expectedBoolean) {
    if (expectedBoolean) {
        this.expectCheckedOf(this.getElement(keyOrElement)).toEqual('true');
    } else {
        this.expectCheckedOf(this.getElement(keyOrElement)).toBeNull();
    }
    return this;
};

IceBasePage.prototype.verifyElementClassMatches = function(keyOrElement, expected) {
    this.expectClassOf(this.getElement(keyOrElement)).toMatch(expected);
    return this;
};

module.exports = IceBasePage;