<script setup lang="ts">
import { useHttpClient } from '@/common/composables/services/useHttpClient';
import { ROUTE_META } from '@/common/constants/routeMeta';
import { TOAST_LIFE } from '@/common/constants/toastLife';
import { type CmsApiResponse } from '@/common/contracts/cmsApi';
import AppButton from '@/features/components/AppButton.vue';
import FieldConstructor from '@/features/forms/FieldConstructor.vue';
import { useFormSetup } from '@/features/forms/useFormSetup';
import { InputText, useToast } from 'primevue';
import { type GenericObject, type SubmissionContext } from 'vee-validate';
import { computed, ref, useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';
import { type FormElement } from '../forms/interfaces';
import { doRx } from '@/common/composables/reactivity/doRx';
import { credentialsProvider, init, initializeLogin } from '@tidal-music/auth';

const router = useRouter()
const toast = useToast();

const elements = ref<FormElement[]>([
  {
    componentType: 'textField',
    dataType: 'string',
    propertyName: 'clientId',
    labelText: 'Client ID',
    validationConstraints: [{constraintType: 'notNull'}],
    readonly: false,
    nullable: false
  },
  {
    componentType: 'textField',
    dataType: 'string',
    propertyName: 'redirectUrl',
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


const artistsSearchInput = ref();

const { ref: event_searchArtists, adapt: trigger_searchArtists } = doRx(undefined, {adapter: () => artistsSearchInput.value});

const url = computed(() => {
  let _ = 'https://openapi.tidal.com/search?';
  const queryString = new URLSearchParams({
    countryCode: 'NO',
    limit: '10',
    query: event_searchArtists.value,
    type: 'ARTISTS',
  }).toString()

  return _+queryString
});

const artistsSearchAPI = useHttpClient(url, { 
  refetch: true,
  async beforeFetch({ url, options, cancel }) {
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

const artistsSearchResult = doRx([]).subscribe(event_searchArtists, ({incoming}, {ref}) => {
  ref.value = incoming;
})

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

      <div id="brand">
        <img
          :src="logoUrl"
          class="block"
          style="width: 150%;"
        >
        <!-- <h1 class="flex flex-column mt-0">
          <span class="block font-bold" style="letter-spacing: -0.25rem;font-size: 4rem;line-height: 1.9rem;">Element</span>
          <span class="font-light">
            <span style="margin-right: 4.2rem;font-size: 2.8rem;">C</span>
            <span style="margin-right: 4.2rem;font-size: 2.8rem;">M</span>
            <span style="font-size: 2.8rem;">S</span>
          </span>
        </h1> -->
        <h1 class="flex flex-column mt-0">
          <span
            class="block font-bold"
            style="letter-spacing: -0.25rem;font-size: 4rem;line-height: 1.9rem;"
          >Element</span>
          <span class="font-light">
            <span style="margin-right: 1.2rem;font-size: 2.8rem;">C</span>
            <span style="margin-right: 1.2rem;font-size: 2.8rem;">M</span>
            <span style="font-size: 2.8rem;">S</span>
          </span>
        </h1>
      </div>
    </div>

    <div id="login-section">
      <div id="login-form">
        <form @keyup.enter="formSubmit()">
          <FieldConstructor
            :field="formSetup.fields.value.clientId"
          />
          <FieldConstructor
            :field="formSetup.fields.value.redirectUrl"
          />
        </form>

          <AppButton
            @click="formSubmit()"
            label="Log In"
            class="w-full mt-4 p-3 text-xl"
          />
      </div>
        
        <InputText v-model="artistsSearchInput"></InputText>
        <AppButton
          @click="trigger_searchArtists()"
          label="Log In"
          class="w-full mt-4 p-3 text-xl"
        />

        <ul>
          <li v-for="artist of artistsSearchResult"><a :href="`https://listen.tidal.com/artist/${artist.resource?.id}`"><img :src="artist.resource?.picture.find(p => p.width === 160)" /> <span>{{ artist.resource?.name }}</span></a></li>
        </ul>
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
  justify-content: flex-start;
  align-items: center;
  padding-left: 50px;
  background-color: hwb(33deg 96% 0%);
  position: relative;

  &:before {
    content: '';
    position: absolute;
    transform: translateX(-51px);
    width: 100%;
    height: calc(100vh - 18px);
    background-image: url("/pattern.png");
    background-position: top;
    background-repeat: no-repeat;
    background-size: auto 21vw;
  }

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