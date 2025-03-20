<template>
    <nav aria-label="Page navigation example">
        <ul class="pagination">
            <slot></slot>
        </ul>
    </nav>
</template>
<script>
    export default {
        name: 'Paginate',
    }
</script>
<style>
    .pagination {
        margin: 0;
    }
    .pagination:focus {
        background-color: red;
    }
    .page-link {
        background-color: #343A49;
        color: #6261cc;
        border: none;
    }
    .page-item {
        margin: 1px;
    }
    .page-link:hover {
        background-color: #2F3541;
        color: #6261cc;
    }

    .page-item.active a {
        background-color: #6261CC;
    }

    .pagination {
        --bs-pagination-focus-bg: #343A49;
        --bs-pagination-focus-color: #6261cc;
        --bs-pagination-focus-box-shadow: 0 0 0 0.10rem rgba(98, 97, 240, 0.3);
    }

</style>