import { shallowMount } from '@vue/test-utils'
import App from '@/App.vue'
import PageHome from '@/components/PageHome.vue'
import PageArtists from '@/components/PageArtists.vue'
import PageRanking from '@/components/PageRanking.vue'
import PageVoting from '@/components/PageVoting.vue'

describe('App.vue', () => {
  let wrapper

  beforeEach(() => {
    // Use shallowMount to avoid rendering child components
    wrapper = shallowMount(App)
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders navigation list', () => {
    const navItems = wrapper.findAll('li')
    expect(navItems.length).toBe(4)
    expect(navItems.at(0).text()).toBe('home')
    expect(navItems.at(1).text()).toBe('artists')
    expect(navItems.at(2).text()).toBe('ranking')
    expect(navItems.at(3).text()).toBe('voting')
  })

  it('initializes with voting page active', () => {
    expect(wrapper.vm.activePage).toBe('voting')
    expect(wrapper.findComponent(PageVoting).exists()).toBe(true)
  })

  it('changes page when navigation item is clicked', async () => {
    // Click the home navigation item
    await wrapper.findAll('li').at(0).trigger('click')
    
    // Check if page changed
    expect(wrapper.vm.activePage).toBe('home')
    expect(wrapper.findComponent(PageHome).exists()).toBe(true)
    expect(wrapper.findComponent(PageVoting).exists()).toBe(false)
  })

  it('shows correct component for each page', async () => {
    // Test home page
    wrapper.vm.changePage('home')
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(PageHome).exists()).toBe(true)
    expect(wrapper.findComponent(PageArtists).exists()).toBe(false)

    // Test artists page
    wrapper.vm.changePage('artists')
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(PageHome).exists()).toBe(false)
    expect(wrapper.findComponent(PageArtists).exists()).toBe(true)

    // Test ranking page
    wrapper.vm.changePage('ranking')
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(PageRanking).exists()).toBe(true)
    expect(wrapper.findComponent(PageArtists).exists()).toBe(false)

    // Test voting page
    wrapper.vm.changePage('voting')
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(PageVoting).exists()).toBe(true)
    expect(wrapper.findComponent(PageRanking).exists()).toBe(false)
  })

  it('handles page change event from PageVoting', async () => {
    // Mock the event from PageVoting
    wrapper.findComponent(PageVoting).vm.$emit('cp', 'ranking')
    await wrapper.vm.$nextTick()
    
    expect(wrapper.vm.activePage).toBe('ranking')
    expect(wrapper.findComponent(PageRanking).exists()).toBe(true)
  })

  it('has correct initial data', () => {
    expect(wrapper.vm.pages).toEqual(['home', 'artists', 'ranking', 'voting'])
    expect(wrapper.vm.activePage).toBe('voting')
  })

  it('renders main app container', () => {
    expect(wrapper.find('#app').exists()).toBe(true)
  })

  it('logs page changes to console', () => {
    console.log = jest.fn()
    wrapper.vm.changePage('home')
    expect(console.log).toHaveBeenCalledWith('Changing page to: home')
  })
})
