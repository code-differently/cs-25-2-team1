import java.time.LocalDate;

public class debug_test {
    public static void main(String[] args) {
        // Create test objects
        com.codedifferently.cs_252_team1.fitnessManagementApp.Member member = new com.codedifferently.cs_252_team1.fitnessManagementApp.Member();
        member.setFirstName("John");
        member.setLastName("Doe");
        
        com.codedifferently.cs_252_team1.fitnessManagementApp.KeyCard card = new com.codedifferently.cs_252_team1.fitnessManagementApp.KeyCard("MEM12345", member, LocalDate.now().plusYears(1));
        
        System.out.println("toString output: " + card.toString());
        System.out.println("Card type: " + card.getCardType());
    }
}
