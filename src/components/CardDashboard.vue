<template>
    <q-card v-ripple:primary class="my-card" bordered >
        <q-item v-if="load">
            <q-item-section caption>
                <q-item-label>
                    <q-skeleton type="QToolbar" />
                </q-item-label>
            </q-item-section>
            <q-item-section avatar>
                  <q-skeleton type="QAvatar" />
            </q-item-section>
        </q-item>
        <q-card-section v-else horizontal>
            <div class="col flex flex-center text-h5">
               {{ count }} - {{ label }}
            </div>
    
            <q-card-actions vertical class="justify-around q-px-md">
            <q-btn flat round color="primary" :icon="icon" />

            </q-card-actions>
        </q-card-section>
        </q-card>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import userAuthUser from 'src/composables/UseAuthUser'
import useApi from 'src/composables/UseApi'

export default defineComponent({
    name: 'CardDeshboard',
    props: {
        table: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            required: false,
            default: 'mdi-database-outline'
        }
    },
    setup(props) {
        
        const count = ref(0)
        const { user } = userAuthUser()
        const { fetchCount } = useApi()
        const load = ref(true)
        
        onMounted(async () => {
            const response = await fetchCount(props.table, user.value.id)
            count.value = response.count
            load.value = false
        })
        return {
            count,
            load
        }
    },
})
</script>
