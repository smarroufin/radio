<script setup lang="ts">
interface Item {
  label: string
  [key: string]: unknown
}

const props = defineProps({
  modelValue: {
    type: Object as PropType<Item[]>,
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

const items = computed(() => searchItems(props.items, searchTerm.value, ['label']))
</script>

<template>
  <USelectMenu
    v-model="value"
    v-model:search-term="searchTerm"
    multiple
    :items="items"
    virtualize
    search-input
    ignore-filter
    placeholder="Tags"
    :disabled="disabled"
    :ui="{ base: 'rounded-full' }"
  >
    <div
      v-if="value.length"
      class="flex overflow-hidden gap-1"
    >
      <AppTag
        v-for="{ label: tag } of value"
        :key="tag"
        :tag="tag"
        mode="remove"
      />
    </div>
  </USelectMenu>
</template>
