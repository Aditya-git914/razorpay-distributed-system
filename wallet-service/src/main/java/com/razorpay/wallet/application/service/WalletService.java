package com.razorpay.wallet.application.service;

import com.razorpay.common.dto.WalletDTO;
import com.razorpay.common.enums.WalletTxnType;
import com.razorpay.common.exception.InsufficientBalanceException;
import com.razorpay.common.exception.ResourceNotFoundException;
import com.razorpay.wallet.domain.model.Wallet;
import com.razorpay.wallet.domain.model.WalletTransaction;
import com.razorpay.wallet.domain.repository.WalletRepository;
import com.razorpay.wallet.domain.repository.WalletTransactionRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class WalletService {

    private final WalletRepository walletRepository;
    private final WalletTransactionRepository transactionRepository;

    @PostConstruct
    public void seedDemoWallet() {
        UUID demoUserId = UUID.fromString("22222222-2222-2222-2222-222222222222");
        if (walletRepository.findByUserId(demoUserId).isEmpty()) {
            Wallet wallet = Wallet.builder()
                    .userId(demoUserId)
                    .balance(new BigDecimal("50000.00"))
                    .currency("INR")
                    .build();
            wallet = walletRepository.save(wallet);

            WalletTransaction txn = WalletTransaction.builder()
                    .walletId(wallet.getId())
                    .type(WalletTxnType.CREDIT)
                    .amount(new BigDecimal("50000.00"))
                    .balanceAfter(new BigDecimal("50000.00"))
                    .referenceId("topup_init_001")
                    .description("Initial wallet credit balance")
                    .build();
            transactionRepository.save(txn);
            log.info("Demo wallet seeded with initial balance 50,000 INR");
        }
    }

    @Transactional
    public Wallet getOrCreateWallet(UUID userId) {
        return walletRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Wallet w = Wallet.builder()
                            .userId(userId)
                            .balance(BigDecimal.ZERO)
                            .currency("INR")
                            .build();
                    return walletRepository.save(w);
                });
    }

    public WalletDTO getWalletByUserId(UUID userId) {
        Wallet wallet = getOrCreateWallet(userId);
        return mapToDTO(wallet);
    }

    @Transactional
    public WalletDTO credit(UUID userId, BigDecimal amount, String refId, String description) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Credit amount must be greater than zero");
        }

        Wallet wallet = walletRepository.findByUserIdForUpdate(userId)
                .orElseGet(() -> getOrCreateWallet(userId));

        BigDecimal newBalance = wallet.getBalance().add(amount);
        wallet.setBalance(newBalance);
        wallet = walletRepository.save(wallet);

        WalletTransaction txn = WalletTransaction.builder()
                .walletId(wallet.getId())
                .type(WalletTxnType.CREDIT)
                .amount(amount)
                .balanceAfter(newBalance)
                .referenceId(refId)
                .description(description != null ? description : "Wallet recharge")
                .build();
        transactionRepository.save(txn);

        return mapToDTO(wallet);
    }

    @Transactional
    public WalletDTO debit(UUID userId, BigDecimal amount, String refId, String description) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Debit amount must be greater than zero");
        }

        Wallet wallet = walletRepository.findByUserIdForUpdate(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet", "userId", userId));

        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException(
                    String.format("Insufficient funds. Available: ₹%s, Required: ₹%s",
                            wallet.getBalance().toPlainString(), amount.toPlainString()));
        }

        BigDecimal newBalance = wallet.getBalance().subtract(amount);
        wallet.setBalance(newBalance);
        wallet = walletRepository.save(wallet);

        WalletTransaction txn = WalletTransaction.builder()
                .walletId(wallet.getId())
                .type(WalletTxnType.DEBIT)
                .amount(amount)
                .balanceAfter(newBalance)
                .referenceId(refId)
                .description(description != null ? description : "Payment deduction")
                .build();
        transactionRepository.save(txn);

        return mapToDTO(wallet);
    }

    public List<WalletDTO.Transaction> getTransactions(UUID walletId) {
        return transactionRepository.findByWalletIdOrderByCreatedAtDesc(walletId).stream()
                .map(t -> WalletDTO.Transaction.builder()
                        .id(t.getId())
                        .walletId(t.getWalletId())
                        .type(t.getType())
                        .amount(t.getAmount())
                        .balanceAfter(t.getBalanceAfter())
                        .referenceId(t.getReferenceId())
                        .description(t.getDescription())
                        .createdAt(t.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    private WalletDTO mapToDTO(Wallet w) {
        return WalletDTO.builder()
                .id(w.getId())
                .userId(w.getUserId())
                .balance(w.getBalance())
                .currency(w.getCurrency())
                .updatedAt(w.getUpdatedAt())
                .build();
    }
}
