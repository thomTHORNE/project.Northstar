<script setup lang="ts">
import { doRx } from '@/common/composables/reactivity/doRx';
import { useHttpClient } from '@/common/composables/services/useHttpClient';
import AppButton from '@/features/components/AppButton.vue';
import FieldConstructor from '@/features/forms/FieldConstructor.vue';
import { useFormSetup } from '@/features/forms/useFormSetup';
import { credentialsProvider, finalizeLogin, init, initializeLogin } from '@tidal-music/auth';
import { InputText, useToast } from 'primevue';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { type FormElement } from '../forms/interfaces';

const router = useRouter()
const route = useRoute()
const toast = useToast();

const storedClientId = ref();
const storedRedirectUri = ref();

// export const authErrorCodeMap = {
//   authenticationError: 'A0000',
//   illegalArgumentError: 'A0007',
//   initError: 'A0001',
//   networkError: 'A0002',
//   retryableError: 'A0003',
//   storageError: 'A0004',
//   tokenResponseError: 'A0005',
//   unexpectedError: 'A0006',
// } as const;


onMounted(async () => {
  storedClientId.value = localStorage.getItem('clientId');
  storedRedirectUri.value = localStorage.getItem('redirectUri');

  if (storedClientId.value && storedRedirectUri.value) {
      await init({
        clientId: storedClientId.value,
        credentialsStorageKey: 'authorizationCode',
      });


    if(route.query.code && route.query.code.length > 0) {
      await finalizeLogin(window.location.search);
      router.replace({path: route.path})
    } else {
      getUserInfo();
    }
  }
})

const elements = ref<FormElement[]>([
  {
    value: '5rvQXOCb3zyGPfbw',
    componentType: 'textField',
    dataType: 'string',
    propertyName: 'clientId',
    labelText: 'Client ID',
    validationConstraints: [{constraintType: 'notNull'}],
    readonly: false,
    nullable: false
  },
  {
    value: 'http://localhost:5173/login',
    componentType: 'textField',
    dataType: 'string',
    propertyName: 'redirectUri',
    labelText: 'Redirect url',
    validationConstraints: [{constraintType: 'notNull'}],
    readonly: false,
    nullable: false
  }
]);


const formSetup = useFormSetup(elements)
const formSubmit = formSetup.form
  .handleSubmit(async (values) => {
    // store these values, since we need them after the redirect
    localStorage.setItem('clientId', values.clientId);
    localStorage.setItem('redirectUri', values.redirectUri);

    await init({
      clientId: values.clientId,
      credentialsStorageKey: 'authorizationCode',
    });

    const loginUrl = await initializeLogin({
      redirectUri: values.redirectUri,
    });

    window.open(loginUrl, '_self');
    // https://localhost:5173/login?code=eyJraWQiOiJ2OU1GbFhqWSIsImFsZyI6IkVTMjU2In0.eyJ0eXBlIjoibzJfY29kZSIsInVpZCI6MTgxMjkxNTY0LCJzY29wZSI6IiIsImV4cCI6MTc0NTkyNjcxNiwiY2FsbGJhY2tVcmlJZCI6ImQ3NzBlZWQyLTRkZjYtNDc4Ni1iMTQzLWI5MDBlYjQ1MzExZCIsImNpZCI6MTQ0MTYsImNoYWxsZW5nZUlkIjoiMjJhNTMyYTEtYjRlNS00YzAxLWE0MTYtYWZlYzM4ZjA4YWE0IiwibG0iOiJnIiwiaXNzIjoiaHR0cHM6Ly9hdXRoLnRpZGFsLmNvbS92MSJ9.W3LzKDXgRN2K7wPb7Nu3TznTDcwby2E6Wna9IUCWmCrZSn0_fAkum8ezCQEPLb4RBVY7TB62yZk7eFNGDzTqlA&state=na
  })
  
// const loginApi = useHttpClient('auth/login', { immediate: false })
//   .post(formSetup.form.values)
//   .json<CmsApiResponse<any>>();
// loginApi.onFetchResponse(() => {
//   console.log('loginApi.data.value: ', loginApi.data.value);

//   if (!loginApi.data.value?.result) {
//     toast.add({
//       severity: "error",
//       summary: "Invalid data",
//       detail: loginApi.data.value?.message,
//       life: TOAST_LIFE
//     });
//   }
//   router.push({ name: ROUTE_META.home.name })
// })


const artistSearchInput = ref();

const { ref: event_searchArtist, adapt: trigger_searchArtist } = doRx(undefined, {adapter: () => artistSearchInput.value});

const url = computed(() => {
  let _ = 'https://openapi.tidal.com/v2/artists?';
  const queryString = new URLSearchParams({
    countryCode: 'NO',
    include: 'albums',
    'filter[handle]': [event_searchArtist.value].toString()
  }).toString()

  return _+queryString
});

const artistSearchAPI = useHttpClient(url, { 
  refetch: true,
  immediate: false,
  async beforeFetch({ url, options, cancel }) {
    const credentials = await credentialsProvider.getCredentials();

    options.headers = {
      ...options.headers,
      Accept: 'application/vnd.tidal.v1+json',
      Authorization: `Bearer ${credentials.token}`,
      'Content-Type': 'application/vnd.tidal.v1+json',
    }

    return {
      options,
    }
  }})
  .json();
// const getPageApi = useHttpClient(computed(() => routeTableName.value + '/getPageData'), { refetch: true })
//   .post(computed(() => payload_getPage.value))
//   .json<CmsApiResponse<CmsGetPageData>>();

// const artistsSearchResult = doRx([]).subscribe(event_searchArtist, ({incoming}, {ref}) => {
//   ref.value = incoming;
// })

async function getUserInfo(apiSubStatus?) {
  const credentials = await credentialsProvider.getCredentials(apiSubStatus);

  console.log('credentials', credentials)
  console.log('token', base64UrlDecode(credentials.token))
};

 const base64UrlDecode = token => {
  try {
    const [, body] = token.split('.');
    return JSON.parse(globalThis.atob(body));
  } catch (error) {
    console.error(error);
  }
};

const logoUrl = computed(() => {
  // return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
  return `/binom_logo.svg`;
});
</script>


<template>
  <div id="login-container">
    <div id="branding-section">
      <div class="blur-element blur-dark"></div>
      <div class="blur-element blur-warm"></div>
      <div id="noise-overlay"></div>
    </div>

    <div id="login-section">
      <div id="login-form">
        <form @keyup.enter="formSubmit()">
          <FieldConstructor
            :field="formSetup.fields.value.clientId"
          />
          <FieldConstructor
            :field="formSetup.fields.value.redirectUri"
          />
        </form>

          <AppButton
            @click="formSubmit()"
            label="Log In"
            class="w-full mt-4 p-3 text-xl"
          />
      </div>

      <div v-if="storedClientId && storedRedirectUri" class="block my-4">

        <label class="block" for="artistSearchInput">Search artist</label>
        <InputText id="artistSearchInput" v-model="artistSearchInput"></InputText>

        <AppButton
          @click="trigger_searchArtist()"
          label="Search"
          class="w-full mt-4 p-3 text-xl"
        />

        <ul>
          <li v-for="artist of artistSearchAPI.data"><a :href="`https://listen.tidal.com/artist/${artist?.resource?.id}`"><img :src="artist?.resource?.picture.find(p => p.width === 160)" /> <span>{{ artist?.resource?.name }}</span></a></li>
        </ul>
        <p>{{ artistSearchAPI.data }}</p>
      </div>

    </div>
  </div>
</template>


<style scoped lang="css">
#login-container {
  display: flex;
  height: calc(100vh - 16px);
  border: 2px solid var(--p-surface-400);
  border-radius: 5px;
}

#branding-section {
  border-radius: 5px 0 0 5px;
  flex-basis: 400px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  border-right: 1px solid var(--p-surface-200);
  background-color: hwb(33deg 90% 0%);
}

#brand {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transform: translateY(-115px);
}

#login-section {
  background-blend-mode: difference;
  background-image: url("/pattern.png");
  background-position: top;
  background-repeat: no-repeat;
  background-size: auto 21vw;
  border-radius: 0 5px 5px 0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-left: 50px;
  background-color: hwb(33deg 96% 0%);
  position: relative;

  #login-form {
    z-index: 2;
  }
}

.blur-element {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
}

.blur-dark {
  background-color: #4A4A54;
  width: 300px;
  height: 300px;
  top: -2%;
  left: -5%;
}

.blur-warm {
  background-color: #c99575;
  /* background-color: #C2967A; */
  width: 210px;
  height: 210px;
  top: 58%;
  right: 5%;
  z-index: 1;
}

.blur-red {
  background-color: #9A6F6C;
  width: 200px;
  height: 200px;
  bottom: 5%;
  right: 20%;
}


@keyframes noise {
  0%,
  100% {
    background-position: 0 0;
  }

  10% {
    background-position: -5% -10%;
  }

  20% {
    background-position: -15% 5%;
  }

  30% {
    background-position: 7% -25%;
  }

  40% {
    background-position: 20% 25%;
  }

  50% {
    background-position: -25% 10%;
  }

  60% {
    background-position: 15% 5%;
  }

  70% {
    background-position: 0% 15%;
  }

  80% {
    background-position: 25% 35%;
  }

  90% {
    background-position: -10% 10%;
  }
}

#noise-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.25;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  pointer-events: none;
  animation: noise 8s steps(10) infinite;
  mix-blend-mode: overlay;
  z-index: 2;
}

@media (max-width: 768px) {
  #login-container {
    flex-direction: column;
  }

  #branding-section {
    flex-basis: auto;
    height: 200px;
  }

  #login-section {
    padding: 20px;
    justify-content: center;
  }
}
</style>