import { shallowMount } from '@vue/test-utils'
import PageHome from '@/components/PageHome.vue'

describe('PageHome', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(PageHome)
  })

  it('renders welcome message', () => {
    expect(wrapper.find('h1').text()).toBe('Welkom op eurosong.be')
  })

  it('renders description text', () => {
    expect(wrapper.find('p').text()).toContain('Op deze website kan je stemmen')
  })

  it('has correct component name', () => {
    expect(wrapper.vm.$options.name).toBe('PageHome')
  })
})
