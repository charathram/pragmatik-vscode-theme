// Order processing service.
// Shows: attributes, records, generics, async, LINQ, interpolation.
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Pragmatik.Samples
{
    public enum OrderState { Pending, Shipped, Cancelled }

    public record Order(Guid Id, string Customer, decimal Total, OrderState State);

    public interface IOrderRepository
    {
        Task<IReadOnlyList<Order>> GetAllAsync();
    }

    [Serializable]
    public sealed class OrderService
    {
        private const decimal FreeShippingThreshold = 50.00m;
        private readonly IOrderRepository _repository;

        public OrderService(IOrderRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        public int MaxRetries { get; init; } = 3;

        /// <summary>Returns pending orders that ship for free.</summary>
        [Obsolete("Use GetEligibleOrdersAsync instead.")]
        public async Task<List<Order>> GetFreeShippingOrdersAsync()
        {
            var orders = await _repository.GetAllAsync();
            return orders
                .Where(o => o.State == OrderState.Pending && o.Total >= FreeShippingThreshold)
                .OrderByDescending(o => o.Total)
                .ToList();
        }

        public static string Describe(Order order) => order switch
        {
            { State: OrderState.Cancelled } => $"Order {order.Id} was cancelled.",
            { Total: > 100m } => $"Large order for {order.Customer}: {order.Total:C}",
            _ => $"Order for {order.Customer}\t(total {order.Total:C})",
        };
    }
}
