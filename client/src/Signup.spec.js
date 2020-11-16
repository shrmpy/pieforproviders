import React from "react"
import {AuthLayout} from "_shared"
import {mount} from 'cypress-react-unit-test'

describe('Signup', () => {
  it('show scrollbar of height/y direction', () => {
    const signupForm = {
	    text: 'lots of html content to extend beyond viewport'
    }
    mount(<AuthLayout contentComponent={signupForm} />)
    const scrollbar = cy.get('[role=scrollbar]')
  })
})


