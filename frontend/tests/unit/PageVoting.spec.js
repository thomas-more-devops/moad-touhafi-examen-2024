import { shallowMount } from '@vue/test-utils'
import PageVoting from '@/components/PageVoting.vue'

describe('PageVoting', () => {
  let wrapper
  const mockSongs = [
    { song_id: 1, artist_name: 'Artist 1', song_name: 'Song 1' },
    { song_id: 2, artist_name: 'Artist 2', song_name: 'Song 2' }
  ]

  beforeEach(async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockSongs)
      })
    )
    wrapper = shallowMount(PageVoting)
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick() // Wait for fetch to complete
  })

  afterEach(() => {
    wrapper.destroy()
    jest.clearAllMocks()
  })

  it('starts with index 0', () => {
    expect(wrapper.vm.activeSongIndex).toBe(0)
  })

  it('displays song info when songs are available', () => {
    expect(wrapper.text()).toContain('Artist 1')
    expect(wrapper.text()).toContain('Song 1')
  })

  it('navigates through songs', async () => {
    // Find the "Next song" button
    const nextButton = wrapper.findAll('button').wrappers
      .find(button => button.text().includes('Next song'))
    
    // Click next button
    await nextButton.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.activeSongIndex).toBe(1)
    
    // Find the "Prev song" button
    const prevButton = wrapper.findAll('button').wrappers
      .find(button => button.text().includes('Prev song'))
    
    // Click prev button
    await prevButton.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.activeSongIndex).toBe(0)
  })

  it('disables prev button at first song', () => {
    const prevButton = wrapper.findAll('button').wrappers
      .find(button => button.text().includes('Prev song'))
    expect(prevButton.attributes('disabled')).toBe('disabled')
  })

  it('disables next button at last song', async () => {
    // Set to last song
    wrapper.vm.activeSongIndex = mockSongs.length - 1
    await wrapper.vm.$nextTick()
    
    const nextButton = wrapper.findAll('button').wrappers
      .find(button => button.text().includes('Next song'))
    expect(nextButton.attributes('disabled')).toBe('disabled')
  })

  it('disables vote buttons after they are used', async () => {
    wrapper.vm.votesSended = [2]
    await wrapper.vm.$nextTick()
    
    const twoPointButton = wrapper.findAll('button').wrappers
      .find(button => button.text().includes('Add 2 votes'))
    expect(twoPointButton.attributes('disabled')).toBe('disabled')
  })

  it('emits change page event after three votes', async () => {
    wrapper.vm.votesSended = [2, 4]
    await wrapper.vm.$nextTick()
    
    // Find and click the 6-point vote button
    const sixPointButton = wrapper.findAll('button').wrappers
      .find(button => button.text().includes('Add 6 votes'))
    
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true })
      })
    )
    
    await sixPointButton.trigger('click')
    await wrapper.vm.$nextTick()
    
    expect(wrapper.emitted('cp')).toBeTruthy()
    expect(wrapper.emitted('cp')[0]).toEqual(['ranking'])
  })
})
