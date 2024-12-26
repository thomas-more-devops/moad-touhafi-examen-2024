import { shallowMount } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'

describe('HelloWorld', () => {
  it('renders props.msg when passed', () => {
    const msg = 'Test Message'
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg }
    })
    expect(wrapper.find('h1').text()).toBe(msg)
  })

  it('renders correct number of links', () => {
    const wrapper = shallowMount(HelloWorld)
    const links = wrapper.findAll('a')
    expect(links.length).toBe(13)
  })

  it('has correct link categories', () => {
    const wrapper = shallowMount(HelloWorld)
    expect(wrapper.findAll('h3').length).toBe(3)
    expect(wrapper.text()).toContain('Installed CLI Plugins')
    expect(wrapper.text()).toContain('Essential Links')
    expect(wrapper.text()).toContain('Ecosystem')
  })
})
