import { shallowMount } from '@vue/test-utils'
import PageRanking from '@/components/PageRanking.vue'

describe('PageRanking', () => {
  let wrapper
  const mockRankingData = [
    { artist_name: 'Artist 1', song_name: 'Song 1', total_points: 10 },
    { artist_name: 'Artist 2', song_name: 'Song 2', total_points: 8 },
    { artist_name: 'Artist 3', song_name: 'Song 3', total_points: 6 }
  ]

  beforeEach(async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockRankingData)
      })
    )
    wrapper = shallowMount(PageRanking)
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick() // Wait for fetch to complete
  })

  afterEach(() => {
    wrapper.destroy()
    jest.clearAllMocks()
  })

  it('has a ranking table', () => {
    expect(wrapper.find('table').exists()).toBe(true)
  })

  it('has correct table headers', () => {
    const headers = wrapper.findAll('th')
    expect(headers.length).toBe(3)
    expect(headers.at(0).text()).toBe('Position')
    expect(headers.at(1).text()).toBe('Artist')
    expect(headers.at(2).text()).toBe('Votes')
  })

  it('displays ranking data correctly', async () => {
    const rows = wrapper.findAll('tr')
    // Header row + data rows
    expect(rows.length).toBe(mockRankingData.length + 1)
    
    // Check first data row
    const firstDataRow = rows.at(1)
    expect(firstDataRow.text()).toContain('Artist 1')
    expect(firstDataRow.text()).toContain('Song 1')
    expect(firstDataRow.text()).toContain('10')
  })

  it('displays correct position numbers', () => {
    const positions = wrapper.findAll('td:first-child')
    
    positions.wrappers.forEach((pos, index) => {
      expect(pos.text()).toBe((index + 1).toString())
    })
  })
})
