<template>
    <fwb-table hoverable>
      <fwb-table-head>
        <fwb-table-head-cell>Title</fwb-table-head-cell>
        <fwb-table-head-cell>Category</fwb-table-head-cell>
        <fwb-table-head-cell>Due Date</fwb-table-head-cell>
        <fwb-table-head-cell>Status</fwb-table-head-cell>
        <fwb-table-head-cell>
          <span class="sr-only">Edit</span>
        </fwb-table-head-cell>
      </fwb-table-head>
      <fwb-table-body>
        <fwb-table-row v-for="task in tasks">
          <fwb-table-cell>{{task.title}}</fwb-table-cell>
          <fwb-table-cell>{{ task.category.name }}</fwb-table-cell>
          <fwb-table-cell>{{ task.due_date }}</fwb-table-cell>
          <fwb-table-cell>{{ task.status }}</fwb-table-cell>
          <fwb-table-cell>
            <fwb-a href="#">
              Edit
            </fwb-a>
          </fwb-table-cell>
        </fwb-table-row>

      </fwb-table-body>
    </fwb-table>
  </template>

  <script setup>
  import {
    FwbA,
    FwbTable,
    FwbTableBody,
    FwbTableCell,
    FwbTableHead,
    FwbTableHeadCell,
    FwbTableRow,
  } from 'flowbite-vue'

  const props = defineProps({
    tasks: Array
  })
  
  </script>