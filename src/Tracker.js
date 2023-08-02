import Storage from './Storage'

class Tracker{
    constructor(){
      this._calorieLimit = Storage.getCalorieLimit()
      this._totalCalories = Storage.getTotalCalories(0)
      this._meals = Storage.getMeals()
      this._workouts = Storage.getWorkouts();
  
      this._displayCaloriesRemaining()
      this._displayCaloriesProgress()
      this._displayCalorieConsumed()
      this._displayCalorieBurned()
      this._displayTotalCalories()
      this._displayCalorieLimit()
  
      document.querySelector('#limit').value = this._calorieLimit;
    }
    // Global function
    addMeal(meal){
      this._meals.push(meal)
      this._totalCalories += meal.calories
      Storage.updateTotalCalories(this._totalCalories)
      Storage.saveMeal(meal)
      this._displayNewMeal(meal)
      this._render()
    }
    addWorkout(workout){
      this._workouts.push(workout)
      this._totalCalories -= workout.calories
      Storage.updateTotalCalories(this._totalCalories)
      Storage.saveWorkout(workout);
      this._displayNewWorkout(workout)
      this._render()
    }
    removeMeal(id){
      const index = this._meals.findIndex((meal) => meal.id === id)
      if(index !== -1){
        const meal = this._meals[index]
        this._totalCalories -= meal.calories
        Storage.updateTotalCalories(this._totalCalories)
        this._meals.splice(index, 1)
        Storage.removeMeal(id)
        this._render()
      }
    }
    removeWorkout(id){
      const index = this._workouts.findIndex((workout) => workout.id === id)
      if(index !== -1){
        const workout = this._workouts[index]
        this._totalCalories += workout.calories
        Storage.updateTotalCalories(this._totalCalories)
        this._workouts.splice(index, 1)
        Storage.removeWorkout(id)
        this._render()
      }
    }
    reset(){
      this._totalCalories = 0
      this._meals = []
      this._workouts = []
      Storage.clearAll()
      this._render()
    }
    setLimit(calorieLimit){
      this._calorieLimit = calorieLimit
      Storage.setCalorieLimit(calorieLimit)
      this._displayCalorieLimit()
      this._render()
    }
    loadItems(){
      this._meals.forEach(meal => this._displayNewMeal(meal))
      this._workouts.forEach((workout) => this._displayNewWorkout(workout));
    }
    // private function
    _displayTotalCalories(){
      const totalCalorieEl = document.querySelector('#calories-total')
      totalCalorieEl.innerHTML = this._totalCalories
    }
    _displayCalorieLimit(){
      const caloriesLimitEl = document.querySelector('#calories-limit')
      caloriesLimitEl.innerHTML = this._calorieLimit
      
    }
    _displayCalorieConsumed(){
      const caloriesConsumedEl = document.querySelector('#calories-consumed')
      const consumed = this._meals.reduce((total, meal) => total + meal.calories, 0)
      caloriesConsumedEl.innerHTML = consumed
    }
    _displayCalorieBurned(){
      const caloriesBurnedEl = document.querySelector('#calories-burned')
      const burned = this._workouts.reduce(
        (total, workout) => total + workout.calories, 0)
      caloriesBurnedEl.innerHTML = burned
    }
    _displayCaloriesRemaining(){
      const caloriesRemainingEl = document.querySelector('#calories-remaining')
      const caloriesProgressEl = document.querySelector('#calorie-progress')
      const remaining = this._calorieLimit - this._totalCalories
      caloriesRemainingEl.innerHTML = remaining
  
      if(remaining <= 0){
        caloriesRemainingEl.parentElement.parentElement.classList.remove('bg-light')
        caloriesRemainingEl.parentElement.parentElement.classList.add('bg-danger')
        caloriesProgressEl.classList.remove('bg-succes')
        caloriesProgressEl.classList.add('bg-danger')
      }else{
        caloriesRemainingEl.parentElement.parentElement.classList.add('bg-light')
        caloriesRemainingEl.parentElement.parentElement.classList.remove('bg-danger')
        caloriesProgressEl.classList.add('bg-succes')
        caloriesProgressEl.classList.remove('bg-danger')
      }
    }
    _displayCaloriesProgress(){
      const caloriesProgressEl = document.querySelector('#calorie-progress')
      const percent = (this._totalCalories / this._calorieLimit) * 100
      const width = Math.min(percent, 100)
      caloriesProgressEl.style.width = `${width}%`  
    }
    _displayNewMeal(meal){
      const mealsEl = document.querySelector('#meal-items')
      const mealEl = document.createElement('div')
      mealEl.classList.add('card', 'my-2')
      mealEl.setAttribute('data-id', meal.id)
      mealEl.innerHTML =
      `
      <div class="card-body">
      <div class="d-flex align-items-center justify-content-between">
        <h4 class="mx-1">${meal.name}</h4>
        <div class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5">
        ${meal.calories}
        </div>
        <button class="delete btn btn-danger btn-sm mx-2">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
      `
      mealsEl.append(mealEl)
    }
    _displayNewWorkout(workout){
      const workoutsEl = document.querySelector('#workout-items')
      const workoutEl = document.createElement('div')
      workoutEl.classList.add('card', 'my-2')
      workoutEl.setAttribute('data-id', workout.id)
      workoutEl.innerHTML =
      `
      <div class="card-body">
      <div class="d-flex align-items-center justify-content-between">
        <h4 class="mx-1">${workout.name}</h4>
        <div class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5">
        ${workout.calories}
        </div>
        <button class="delete btn btn-danger btn-sm mx-2">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
      `
      workoutsEl.append(workoutEl)
    }
    _render(){
      this._displayTotalCalories()
      this._displayCalorieConsumed()
      this._displayCalorieBurned()
      this._displayCaloriesRemaining()
      this._displayCaloriesProgress()
    }
  }

  export default Tracker;