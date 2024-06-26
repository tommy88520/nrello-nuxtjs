<script lang="ts" setup>
import type { BoardDocument } from "~/server/models/Board";

definePageMeta({
  middleware: "auth",
});

useHead({
  title: "Boards",
});

const showCreateBoard = ref(false);
const selectedBoard = ref<BoardDocument | undefined>();

const { data, error, refresh } = await useFetch<BoardDocument[]>("/api/boards");
provide("refresh-boards", refresh);

if (error.value) {
  throw createError(error.value);
}

async function handleEdit(board: BoardDocument) {
  selectedBoard.value = board;
  showCreateBoard.value = true;
}

watchEffect(() => {
  if (!showCreateBoard.value) {
    selectedBoard.value = undefined;
  }
});
</script>
<template>
  <WrapperDefault>
    <h1 class="tex-3xl font-semibold">Boards</h1>

    <template #actions>
      <UButton size="xs" @click="showCreateBoard = !showCreateBoard"
        >Create new board</UButton
      >
    </template>

    <!-- Sidesheet  -->
    <USlideover v-model="showCreateBoard">
      <SlideoverHeader
        :title="selectedBoard ? 'Update board' : 'Create board'"
        :on-click="() => (showCreateBoard = false)"
      ></SlideoverHeader>

      <FormBoard
        :type="selectedBoard ? 'update' : 'create'"
        :initial-data="selectedBoard"
        :on-create="
          () => {
            showCreateBoard = false;
            refresh();
          }
        "
        :on-update="
          () => {
            showCreateBoard = false;
            selectedBoard = undefined;
            refresh();
          }
        "
      />
    </USlideover>
    <!-- ./ Sidesheet  -->

    <!-- List of boards -->
    <section class="grid grid-cols-2 lg:grid-cols-5 my-4 gap-4">
      <BoardCard
        v-for="board in data"
        :key="board._id"
        :board="board"
        :on-edit="handleEdit"
      ></BoardCard>

      <!-- <div
        v-for="board in data"
        :key="board._id"
        class="bg-white dark:bg-gray-800 rounded-lg border shadow p-2 text-center"
        @click="
          () => {
            selectedBoard = board;
            showCreateBoard = true;
          }
        "
      >
        {{ board.name }}
      </div> -->
    </section>
    <!-- ./ List of boards -->
  </WrapperDefault>
</template>

<style></style>
