<script setup lang="ts">
interface Item {
  label: string
  value: string
  icon?: string
  [key: string]: unknown
}

const props = defineProps({
  modelValue: {
    type: Object as PropType<Item>,
    required: true,
  },
  items: {
    type: Array as PropType<Item[]>,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])
const value = useVModel(props, 'modelValue', emit)

const searchTerm = ref('')

const items = computed(() => searchItems(props.items, searchTerm.value, ['label', 'code']))
</script>

<template>
  <USelectMenu
    v-model="value"
    v-model:search-term="searchTerm"
    :icon="value?.icon"
    :items="items"
    search-input
    ignore-filter
    placeholder="Country"
    :disabled="disabled"
    :ui="{ base: 'rounded-full' }"
  />
</template>
