"usestrict";
$(document).ready(function () {
   $(".sk-folding-cube").fadeOut(2000, function () {
      $(this)
         .parent()
         .slideUp(1000, function () {
            $(this).remove()
            $('body').removeClass('overflow-hidden')
         });
   });
});
// -------------------- Global Varialbe
let openTime = 800; // time animation
let closeTime = 100; // time animation
let allData = [];
let apiUrl = {
   anotherSearch: (word) =>
      `https://api.themoviedb.org/3/${word}?api_key=48d62e7452a1f1a5e6018217ac27c50a`,
   searchWord: (word) =>
      `https://api.themoviedb.org/3/search/movie?api_key=48d62e7452a1f1a5e6018217ac27c50a&query=${word}`,
};
// -------------------- When Start
(function () {
   getAllData(apiUrl.anotherSearch("movie/now_playing"));
})();
// -------------------- Function
// open or close aside
function openOrCloseAside() {
   let curentLeft = $("aside").css("left");
   let widthAside = $("aside .left").innerWidth();
   if (curentLeft == "0px") {
      // to close aside
      $("aside").animate(
         {
            left: -widthAside,
         },
         700
      );
      // animation for li to close
      for (let i = 0; i < $(".nav__items .nav__link").length; i++) {
         $(".nav__items .nav__link")
            .eq($(".nav__items .nav__link").length - i - 1)
            .animate(
               {
                  top: 300,
               },
               closeTime
            );
         closeTime += 100;
      }
      $("aside #btClose").find("i").addClass("fa-bars").removeClass("fa-xmark");
      closeTime = 100;
   } else {
      // to open aside
      $("aside").animate(
         {
            left: 0,
         },
         700
      );
      // animation for li
      for (let i = 0; i < $(".nav__items .nav__link").length; i++) {
         $(".nav__items .nav__link").eq(i).animate(
            {
               top: 0,
            },
            openTime
         );
         openTime += 200;
      }
      $("aside #btClose").find("i").removeClass("fa-bars").addClass("fa-xmark");
      openTime = 800;
   }
}
// Get Data
async function getData(url) {
   const response = await (await fetch(url)).json();
   allData = response.results;
}
// Display Data
function displayData(list = allData) {
   let dataBox = ``;
   list.forEach((item) => {
      dataBox += `
      <div class="col">
      <div class="card h-100 ">
         <img
            src="https://image.tmdb.org/t/p/original${item.poster_path}"
            alt="movies photo"
            class="w-100"
            onerror="this.src='../images/not-found.svg'"
         />
         <div
            class="layer bg-light bg-opacity-75 text-dark vstack justify-content-center text-center"
         >
            <h2 class="display-6 fs-3">
               ${item.original_title}
            </h2>
            <p class="my-3 ">
             ${item.overview}
            </p>
            <span class="mb-3">rate: ${item.vote_average}</span>
            <span>${item.release_date} </span>
         </div>
      </div>
   </div>
      `;
   });
   $("#moviesBox").html(dataBox);
}
// Search By Word
function getDataWord() {
   let curentValue = $(this).val();
   if (curentValue.length > 0) getAllData(apiUrl.searchWord(curentValue));
}
// Search In Data
function getDataIn() {
   let searchIn = [];
   let curentVal = $(this).val();
   allData.forEach((item) => {
      if (item.original_title.toLowerCase().includes(curentVal.toLowerCase())) {
         searchIn.push(item);
      }
   });
   if (curentVal.length > 0) {
      displayData(searchIn);
   } else {
      displayData();
   }
}
// Search By Nav
function getDataNav(e) {
   const curentHref = $(e.target).attr("href");
   getAllData(apiUrl.anotherSearch(curentHref));
}
// Get All Data
async function getAllData(url) {
   await getData(url);
   displayData();
}
// Validation Form
//user
function regexUser() {
   const userRegex = /^[a-zA-Z][a-zA-Z\s]{2,20}$/;
   return userRegex.test($(".contact__us input").eq(0).val())
      ? ($(".contact__us input").eq(0).next().addClass("d-none"), true)
      : ($(".contact__us input").eq(0).next().removeClass("d-none"), false);
}
// email
function regexEmail() {
   const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
   return emailRegex.test($(".contact__us input").eq(1).val())
      ? ($(".contact__us input").eq(1).next().addClass("d-none"), true)
      : ($(".contact__us input").eq(1).next().removeClass("d-none"), false);
}
// Phone
function regexPhone() {
   const phoneRegex = /^(002)?01[0125]\d{8}$/;
   return phoneRegex.test($(".contact__us input").eq(2).val())
      ? ($(".contact__us input").eq(2).next().addClass("d-none"), true)
      : ($(".contact__us input").eq(2).next().removeClass("d-none"), false);
}
// Age
function regexAge() {
   const ageRegex = /^([1-7][0-9]|80)$/;
   return ageRegex.test($(".contact__us input").eq(3).val())
      ? ($(".contact__us input").eq(3).next().addClass("d-none"), true)
      : ($(".contact__us input").eq(3).next().removeClass("d-none"), false);
}
// Password
function regexPass() {
   const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
   return passRegex.test($(".contact__us input").eq(4).val())
      ? ($(".contact__us input").eq(4).next().addClass("d-none"), true)
      : ($(".contact__us input").eq(4).next().removeClass("d-none"), false);
}
// check for repass
function checkRePass() {
   if (
      $(".contact__us input").eq(4).val() == $(".contact__us input").eq(5).val()
   ) {
      return $(".contact__us input").eq(5).next().addClass("d-none"), true;
   } else {
      return $(".contact__us input").eq(5).next().removeClass("d-none"), false;
   }
}
// -------------------- Events
// open or close aside
$("#btClose").click(openOrCloseAside);
// Search When input in api
$("#searchWord").on("input", getDataWord);
// Search in data
$("#searchIn").on("input", getDataIn);
// Nav Links Search
$(".nav__link a")
   .not('[href^="#"]')
   .click(function (e) {
      e.preventDefault();
      getDataNav(e);
   });
// Validation Form Events
$("form").on("click keyup", function (e) {
   regexUser() &&
   regexEmail() &&
   regexPhone() &&
   regexAge() &&
   regexPass() &&
   checkRePass()
      ? $("#submitBtn").attr("disabled", false)
      : $("#submitBtn").attr("disabled", true);
});
