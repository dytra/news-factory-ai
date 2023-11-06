// SELECT *
// FROM your_table
// WHERE column_name IN (
//     SELECT column_name
//     FROM your_table
//     GROUP BY column_name
//     HAVING COUNT(*) > 1
// );
