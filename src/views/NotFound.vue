<template>
    <div class="not-found">
        <h1 class="not-found-title">404 - Page not found</h1>
        <img src="https://www.svgrepo.com/show/17072/football.svg" alt="Football" class="not-found-image" />
        <p class="not-found-message">Oops! Looks like you've taken a wrong turn.</p>
        <p class="not-found-message">Please go back to the home page.</p>
    </div>
</template>

<style scoped>
.not-found{
    text-align: center;
    padding: 20px;
}

.not-found-title {
    font-size: 32px;
    margin-bottom: 20px;
}

.not-found-image {
    width: 200px;
    height: 200px;
    margin-bottom: 20px;
}

.not-found-message {
    font-size: 18px;
}
</style>