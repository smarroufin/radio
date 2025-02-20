<script setup lang="ts">
const props = defineProps({
  tag: {
    type: String,
    default: '',
  },
  mode: {
    type: String as PropType<'add' | 'remove'>,
    default: 'add',
  },
})

const { addTag, deleteTag } = useSearch()

function onTagClick() {
  if (!props.mode) {
    return
  }
  if (props.mode === 'add') {
    addTag(props.tag)
  }
  else {
    deleteTag(props.tag)
  }
}
</script>

<template>
  <button
    class="inline-flex items-center gap-0.5 bg-neutral-800 px-2 py-0.5 rounded-full cursor-pointer"
    @click.stop="onTagClick"
  >
    <span class="text-xs whitespace-nowrap">
      {{ tag }}
    </span>
    <UIcon
      v-if="mode === 'remove'"
      name="i-carbon-close"
      class="size-3 flex-shink-0 -mr-1"
    />
  </button>
</template>
