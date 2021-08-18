import navbar from "/components/navbar.js";
import navfooter from "/components/navfooter.js";
import loading from "/components/loading.js";
import error from "/components/error.js";
import apimodule from "/assets/apimodule.js";
import unitcontrol from "/components/unitcontrol.js";

export default {
  name: "dashboard",
  components: { navbar, navfooter, loading, error, unitcontrol },
  props: {},
  setup() {
    let isLoading = Vue.reactive({value: false});
    let errorTitle = Vue.reactive({value: "ERROR in Dashboard"});
    let errorMessage = Vue.reactive({value: ""});
    let controlData = Vue.reactive({value: null});

    function loadAmpControls() {
      isLoading.value = true;

      apimodule.getAllAmpControls().then((promiseData) => {
        if (!promiseData?.message?.toLowerCase().includes("successful", 0))
          throw("Unsuccessful response: " + promiseData.message);
          
          controlData.value = promiseData.data.sort(function(controla, controlb) { return controla.sequence - controlb.sequence });
      })
      .catch(exception => {
        errorMessage.value = apimodule.parseError(exception);
        console.log(errorTitle.value + " ; '" + errorMessage.value + "'");
      })
      .finally(() => {
        isLoading.value = false;
      });
    };

    Vue.onMounted(() => {
      loadAmpControls();
    });

    return {
      isLoading,
      errorTitle,
      errorMessage,
      controlData
    };
  },
  methods: {
    notErrorShowing() {
      return (this.errorMessage.value === null || this.errorMessage.value === "") ? true : false;
    },
    showDashboard() {
      return (!this.isLoading.value && this.notErrorShowing()) ? true : false;
    },
    closeError() {
      this.errorMessage.value = "";
    }
  },
  template: `
  <navbar :app-title="'Monoamp'" :active-page-name="'Dashboard'"></navbar>

  <loading :loading-text="'Loading'" :is-loading="isLoading?.value"></loading>
  <error :title="errorTitle?.value" :message="errorMessage?.value" @errorRead="closeError()"></error>

  <div v-if="showDashboard()">
    <div class="dashboard-controls-container">
      <div class="dashboard-unitcontrol" v-for="unitcontrol in controlData?.value">
        <unitcontrol :control=unitcontrol></unitcontrol>
      </div>
    </div>
  </div>

  <navfooter :active-page-name="'Dashboard'"></navfooter>
  `
};
