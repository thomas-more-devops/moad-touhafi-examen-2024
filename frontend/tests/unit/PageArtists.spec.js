import { shallowMount } from '@vue/test-utils'
import PageArtists from '@/components/PageArtists.vue'

describe('PageArtists', () => {
  let wrapper
  const mockArtists = [{ name: 'Artist 1' }, { name: 'Artist 2' }]

  beforeEach(async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockArtists)
      })
    )
    wrapper = shallowMount(PageArtists)
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick() // Wait for fetch to complete
  })

  afterEach(() => {
    wrapper.destroy()
    jest.clearAllMocks()
  })

  it('renders artists list from API', () => {
    expect(wrapper.findAll('li').length).toBe(2)
  })

  it('updates new artist input value', async () => {
    wrapper.vm.newArtist = 'Test Artist'
    await wrapper.vm.$nextTick()
    expect(wrapper.find('input').element.value).toBe('Test Artist')
  })

  it('has an add artist button', () => {
    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.text()).toBe('Add artists')
  })

  it('calls API when adding new artist', async () => {
    const newArtist = 'New Artist'
    wrapper.vm.newArtist = newArtist

    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true })
      })
    )

    await wrapper.find('button').trigger('click')
    await wrapper.vm.$nextTick()

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: newArtist })
      })
    )
  })
})
