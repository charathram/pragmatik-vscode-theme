/*
 * Simple inventory tracker.
 * Shows: preprocessor macros, structs, enums, pointers, escapes.
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_ITEMS 64
#define PRICE_TAX(p) ((p) * 1.08)

typedef enum { IN_STOCK, LOW_STOCK, SOLD_OUT } Status;

typedef struct {
    char name[32];
    unsigned int quantity;
    double price;
    Status status;
} Item;

static const char *status_label(Status s) {
    switch (s) {
    case IN_STOCK:  return "in stock";
    case LOW_STOCK: return "low stock";
    case SOLD_OUT:  return "sold out";
    default:        return "unknown";
    }
}

static void update_status(Item *item) {
    if (item->quantity == 0) {
        item->status = SOLD_OUT;
    } else if (item->quantity < 5) {
        item->status = LOW_STOCK;
    } else {
        item->status = IN_STOCK;
    }
}

int main(void) {
    Item items[MAX_ITEMS] = {0};
    size_t count = 0;

    strncpy(items[count].name, "Widget", sizeof items[count].name - 1);
    items[count].quantity = 12;
    items[count++].price = 3.50;

    strncpy(items[count].name, "Gadget", sizeof items[count].name - 1);
    items[count].quantity = 0x03;
    items[count++].price = 19.99;

    for (size_t i = 0; i < count; i++) {
        update_status(&items[i]);
        printf("%-8s\t%3u\t$%.2f\t(%s)\n",
               items[i].name, items[i].quantity,
               PRICE_TAX(items[i].price), status_label(items[i].status));
    }

    return EXIT_SUCCESS;
}
