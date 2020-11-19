import faker from 'faker'
import { createSelector } from '../utils'

const { name, internet, phone, company, random } = faker
const firstName = name.firstName()
const fullName = name.findName(firstName)
const email = internet.email(firstName)
const password = random.alphaNumeric(15)
// enforces XXX-XXX-XXXX format, which our front-end is enforcing in the application
const phoneNumber = phone.phoneNumberFormat()
const orgName = company.companyName()

describe('Signup', () => {
  beforeEach(() => {
    cy.app('clean')
    cy.server()
    cy.route({
      method: 'POST',
      url: '/signup'
    }).as('signup')
    cy.visit('/signup')
    cy.get(createSelector('organization')).type(orgName)
    cy.get(createSelector('name')).type(fullName)
    cy.get(createSelector('greetingName')).type(firstName)
    cy.get(createSelector('multiBusiness')).click()
    cy.get(createSelector('yesMultiBusiness')).click()
    cy.get(createSelector('phoneType')).click()
    cy.get(createSelector('homePhone')).click()
    cy.get(createSelector('languageEs')).parent().parent().click() // this is annoying but it's because of nested ant design elements
    cy.get(createSelector('password')).type(password)
    cy.get(createSelector('passwordConfirmation')).type(password)
    cy.get(createSelector('terms')).check()
  })
  describe('an existing user signs up', () => {
    beforeEach(() => {
      cy.appFactories([
        [
          'create',
          'user',
          {
            email,
            full_name: fullName,
            greeting_name: firstName,
            phone_number: phoneNumber
          }
        ]
      ])
    })

    describe('duplicate phone', () => {
      it('returns an error', () => {
        cy.get(createSelector('phoneType')).click()
        cy.get(createSelector('homePhone')).click()
        cy.get(createSelector('phoneNumber')).type(phoneNumber)
        cy.get(createSelector('email')).type('random@email.com')
        cy.get(createSelector('signupBtn')).click()
        cy.wait('@signup')
        cy.location('pathname').should('eq', '/signup')
        cy.get('[role="alert"]')
          .contains('Phone number has already been taken')
          .should('exist')
      })
    })

    describe('duplicate email', () => {
      it('returns an error', () => {
        cy.get(createSelector('email')).type(email)
        cy.get(createSelector('signupBtn')).click()
        cy.wait('@signup')
        cy.location('pathname').should('eq', '/signup')
        cy.get('[role="alert"]')
          .contains('Email has already been taken')
          .should('exist')
      })
    })
  })

  describe('new user signs up', () => {
    beforeEach(() => {
      cy.get(createSelector('phoneType')).click()
      cy.get(createSelector('homePhone')).click()
      cy.get(createSelector('phoneNumber')).type(phoneNumber)
      cy.get(createSelector('email')).type(email)
      cy.get(createSelector('signupBtn')).click()
      cy.wait('@signup')
      cy.location('pathname').should('eq', '/signup')
    })

    it('allows the user to sign up and displays confirmation sent info', () => {
      cy.get(createSelector('signupThanks')).should('exist')
    })

    it('allows the user to request new confirmation', () => {
      cy.route({
        method: 'POST',
        url: '/confirmation'
      }).as('resend')
      cy.get(createSelector('signupThanks')).should('exist')
      cy.get(createSelector('resendConfirmation')).click()
      cy.wait('@resend')
      cy.get(createSelector('resent')).should('exist')
    })

    it('displays an error message if the user has already confirmed their account', () => {
      cy.route({
        method: 'POST',
        url: '/confirmation'
      }).as('resend')
      cy.get(createSelector('signupThanks')).should('exist')
      cy.get(createSelector('resendConfirmation')).click()
      cy.wait('@resend')

      cy.appScenario('confirmUserAccount')
      cy.get(createSelector('resendConfirmation')).click()
      cy.wait('@resend')
      cy.location('pathname').should('eq', '/login')
      cy.get(createSelector('authError')).contains(
        'You have already verified your account. You can now log in.',
        {
          matchCase: false
        }
      )
    })

    it('allows the user to scroll in vertical direction', () => {
      cy.viewport('iphone-4')
      cy.scrollTo('center')
      cy.get('html').should('have.prop', 'scrollTop')

      // the body scrollTop is zero (so it isn't scroll-able)
      ////cy.get('body').should('have.prop', 'scrollTop').and('match', /\d\d+/)
      ////cy.get('div#root').should('have.prop', 'scrollTop').and('eq', 0)
      // expect root container to not scroll, too
      ////cy.get('main').should('have.prop', 'scrollTop').and('eq', 0)

      // THEORY - select elements with overflow: scroll / auto
      let count = 0
      cy.get('body')
	.find('div')
        .each(($el, index, $arr) => {
	    let ovf = $el.css('overflow')
	    let ovy = $el.css('overflow-y')
	    if ($el.scrollTop() !== 0
	        && ovf !== 'hidden' && ovy !== 'hidden') {
	        count++
	    }
	})
	.then(() => {
	    expect(count).to.equal(1)
	})

      // expect count is 1 (not counting html/body bar)
      // two scrollbars are drawn

      // the right-half column has overflow but its scrollbar is full height, expect scroll call to fail
      ////cy.get('div#root .ant-row .ant-col').eq(1).scrollTo('bottom').should('fail')

/*      cy.get('body').find('div').its('scrollTop').should('be.gt', 0)
          .should(($p) => {
		  // two scrollbars are on signup page
		  expect($p).to.have.length(2)
	  })
*/
    })
  })
})
