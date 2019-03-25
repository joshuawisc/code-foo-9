# Witcher Armor Question

I found this question quite challenging and spent a lot of time trying to crack. Although I feel there is a better answer I was unable to find it. I recognized the problem as a variation of the Knapsack Problem but couldn't come up with a way to account for the types. I ended using a brute-force method.

I created an Item class to store the item's information. I then created five ArrayLists, one for each item type and 5th for all items. I then used 5 `for()` loops nested in one another to check through all the valid combinations possible and find the one with the highest value. This solution should work with any inventory but it is not very efficient. I believe the complexity is **O(n<sup>5</sup>)**.

The items are read from the *witcher-inventory-csv.csv* file and so it can be changed to try other inventories. The maximum cost of 300 is hardcoded into the **maxCost** variable in the Main.java file which can be changed if need.

## Compiling and Running
The file can be compiled and run in Linux using
```
$ javac Main.java
$ java Main
```

PS: Geralt never wore a helmet in the games, but I guess he finally noticed all the scars on his face.
