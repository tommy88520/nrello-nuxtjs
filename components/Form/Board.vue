<script lang="ts" setup>
import type { FormSubmitEvent } from "~/node_modules/@nuxt/ui/dist/runtime/types/form.d.ts";
import type { z } from "zod";
import BoardSchema from "~/schemas/Board.schema";
import type { BoardDocument } from "~/server/models/Board";

interface Props {
  type: "create" | "update";
  initialData?: Partial<BoardDocument>;
  onUpdate?: (data?: any) => void;
  onCreate?: (data?: any) => void;
}

const porps = withDefaults(defineProps<Props>(), {
  type: "create",
});

const isLoading = ref(false);
const formState = reactive<Partial<BoardDocument>>({
  name: undefined,
  coverImage: undefined,
});

async function handleSubmit(
  event: FormSubmitEvent<z.output<typeof BoardSchema>>
) {
  try {
    isLoading.value = true;
    if (porps.type === "update" && porps.initialData?._id) {
      const updatedBoard = await useFetch(
        `/api/boards/${porps.initialData._id}`,
        {
          method: "POST",
          body: event.data,
          watch: false,
        }
      );
      porps.onUpdate?.(updatedBoard);
      return;
    }

    if (!event.data.coverImage) {
      event.data.coverImage =
        "https://cdn.pixabay.com/photo/2018/02/08/10/22/desk-3139127_150.jpg";
    }

    const { data, error } = await useFetch("/api/boards", {
      method: "POST",
      body: event.data,
      watch: false,
    });

    if (error.value) {
      if (error.value.statusCode === 403) {
        useSubscription().showSubscriptionModal({
          title: "Multiple boards is a Premium Feature",
          description:
            "You can create only one board in free plan. Please upgrade to premium to create more boards.",
        });
      }
    }

    porps.onCreate?.(data);
  } catch (e) {
  } finally {
    isLoading.value = false;
  }
}

watchEffect(() => {
  if (porps.type === "update" && porps.initialData) {
    formState.name = porps.initialData.name;
    formState.coverImage = porps.initialData.coverImage;
  }

  if (porps.type === "create") {
    formState.name = undefined;
    formState.coverImage = undefined;
  }
});
</script>
<template>
  <UForm
    :state="formState"
    :schema="BoardSchema"
    class="p-4"
    @submit="handleSubmit"
  >
    <UFormGroup class="mb-4" name="name" label="Board Name">
      <UInput v-model="formState.name" type="text" placeholder="Board name" />
    </UFormGroup>

    <UFormGroup class="mb-4" name="coverImage" label="Select cover image">
      <ImagePicker v-model="formState.coverImage" />
    </UFormGroup>

    <UButton type="submit" color="primary" block :loading="isLoading">
      {{ type === "create" ? "Create board" : "Update board" }}
    </UButton>
  </UForm>
</template>

<style></style>
