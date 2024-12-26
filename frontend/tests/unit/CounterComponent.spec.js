import { shallowMount } from '@vue/test-utils'
import CounterComponent from '@/components/CounterComponent.vue'

describe('CounterComponent', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(CounterComponent, {
      propsData: {
        initialValue: '5'
      }
    })
  })

  it('initializes with correct value from props', () => {
    expect(wrapper.vm.nummertje).toBe(5)
  })

  it('displays the current number', () => {
    expect(wrapper.find('h2').text()).toBe('5')
  })

  it('increments number when plus button is clicked', async () => {
    await wrapper.find('button').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.nummertje).toBe(6)
  })

  it('decrements number when minus button is clicked', async () => {
    const minusButton = wrapper.findAll('button').at(1)
    await minusButton.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.nummertje).toBe(4)
  })

  it('hides plus button when number reaches 10', async () => {
    wrapper = shallowMount(CounterComponent, {
      propsData: {
        initialValue: '9'
      }
    })
    await wrapper.find('button').trigger('click')
    await wrapper.vm.$nextTick()
    const plusButton = wrapper.findAll('button').wrappers
      .find(button => button.text() === '+')
    expect(plusButton).toBeUndefined()
  })

  it('hides minus button when number reaches 0', async () => {
    wrapper = shallowMount(CounterComponent, {
      propsData: {
        initialValue: '1'
      }
    })
    const minusButton = wrapper.findAll('button').at(1)
    await minusButton.trigger('click')
    await wrapper.vm.$nextTick()
    const minusButtonAfter = wrapper.findAll('button').wrappers
      .find(button => button.text() === '-')
    expect(minusButtonAfter).toBeUndefined()
  })
})
