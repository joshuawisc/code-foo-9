import java.io.File;
import java.util.ArrayList;
import java.util.Scanner;
public class Main {

    public static void main(String[] args) {
        Scanner scan;
        ArrayList<Item> items = new ArrayList<>();
        ArrayList<Item> helmets = new ArrayList<>();
        ArrayList<Item> chests = new ArrayList<>();
        ArrayList<Item> leggings = new ArrayList<>();
        ArrayList<Item> boots = new ArrayList<>();
        int maxCost = 300;
        int count = 0;
        try {
            File file = new File("witcher-inventory-csv.csv");
            scan = new Scanner(file);
            count = Integer.MAX_VALUE;
        } catch (Exception e) {
            System.out.println(e);
            scan = new Scanner(System.in);
            count = scan.nextInt();
            System.out.println("Count: " + count);

        }
        String[] input;
        Item curItem;
        scan.nextLine();
        while(count > 0 && scan.hasNextLine()) {

            input = scan.nextLine().split(",");
            items.add(new Item(input[1], input[0], Integer.parseInt(input[2]), Integer.parseInt(input[3])));
            curItem = items.get(items.size()-1);
            //System.out.println(curItem);
            if (curItem.type.equals("Helmet"))
                helmets.add(curItem);
            else if (curItem.type.equals("Chest"))
                chests.add(curItem);
            else if (curItem.type.equals("Leggings"))
                leggings.add(curItem);
            else
                boots.add(curItem);
            count--;
        }



        Item[] answerItems = new Item[5]; // Stores the indexes of armor set

        int curVal;
        int curCost;
        int maxVal = 0;

        // Loops through helmets, chests, leggings, boots, and finally all items
        // to get all combinations of armor sets and find the best one
        for (int i = 0 ; i < helmets.size() ; i++)
            for (int j = 0 ; j < chests.size() ; j++)
                for (int k = 0 ; k < leggings.size() ; k++)
                    for (int l = 0 ; l < boots.size() ; l++)
                        for (int m = 0 ; m < items.size() ; m++) {
                            curVal = helmets.get(i).val + chests.get(j).val + leggings.get(k).val + boots.get(l).val + items.get(m).val;
                            curCost = helmets.get(i).cost + chests.get(j).cost + leggings.get(k).cost + boots.get(l).cost + items.get(m).cost;
                            //System.out.println(curVal);
                            if (items.get(m) == helmets.get(i) || items.get(m) == chests.get(j) || items.get(m) == leggings.get(k) || items.get(m) == boots.get(l))
                                continue;
                            if (curVal > maxVal && curCost <= maxCost) {
                                maxVal = curVal;
                                answerItems[0] = helmets.get(i);
                                answerItems[1] = chests.get(j);
                                answerItems[2] = leggings.get(k);
                                answerItems[3] = boots.get(l);
                                answerItems[4] = items.get(m);
                            }

                        }


        System.out.println();
        System.out.println();
        for (int i = 0; i < 5; i++) {
            System.out.println(answerItems[i]);
        }
        System.out.println(maxVal);
    }

}

class Item {
    String name;
    String type;
    int cost;
    int val;

    public Item(String name, String type, int cost, int val) {
        this.name = name;
        this.type = type;
        this.cost = cost;
        this.val = val;
    }

    public String toString() {
        return "Name: " + this.name + "\nType: " + this.type + "\nCost: " + this.cost + "\nValue: " + this.val + "\n";
    }
}
