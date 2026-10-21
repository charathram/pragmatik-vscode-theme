package tech.pragmatik.samples;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * A small library catalog.
 * Shows: annotations, generics, lambdas, streams, text blocks.
 *
 * @author Pragmatik
 */
public class LibraryCatalog {

    public static final int MAX_LOANS = 5;
    private final List<Book> books = new ArrayList<>();

    public record Book(String isbn, String title, int year, boolean onLoan) {}

    @FunctionalInterface
    interface BookFilter {
        boolean test(Book book);
    }

    public void add(Book book) {
        if (book == null) {
            throw new IllegalArgumentException("book must not be null");
        }
        books.add(book);
    }

    public Optional<Book> findByIsbn(String isbn) {
        return books.stream()
                .filter(b -> b.isbn().equals(isbn))
                .findFirst();
    }

    public List<Book> filter(BookFilter filter) {
        return books.stream().filter(filter::test).toList();
    }

    @Override
    public String toString() {
        String header = """
                Catalog
                -------
                """;
        StringBuilder sb = new StringBuilder(header);
        for (Book b : books) {
            sb.append(String.format("%s (%d)%s%n", b.title(), b.year(), b.onLoan() ? " *" : ""));
        }
        return sb.toString();
    }

    public static void main(String[] args) {
        var catalog = new LibraryCatalog();
        catalog.add(new Book("978-0131103627", "The C Programming Language", 1988, false));
        catalog.add(new Book("978-0201633610", "Design Patterns", 1994, true));

        int thisYear = LocalDate.now().getYear();
        List<Book> classics = catalog.filter(b -> thisYear - b.year() > 25);

        System.out.println(catalog);
        System.out.println("Classics: " + classics.size() + "\tMax loans: " + MAX_LOANS);
    }
}
