package com.example.demo.service;

import com.example.demo.model.Etudiant;
import com.example.demo.repository.EtudiantRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EtudiantServiceTest {

    @Mock
    private EtudiantRepository etudiantRepository;

    @InjectMocks
    private EtudiantService etudiantService;

    private Etudiant etudiant;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        etudiant = new Etudiant(1L, "Rakoto", "Jean", "jean.rakoto@mail.com");
    }

    @Test
    void testGetAllEtudiants() {
        when(etudiantRepository.findAll()).thenReturn(Arrays.asList(etudiant));
        List<Etudiant> result = etudiantService.getAllEtudiants();
        assertEquals(1, result.size());
        verify(etudiantRepository, times(1)).findAll();
    }

    @Test
    void testGetEtudiantById_found() {
        when(etudiantRepository.findById(1L)).thenReturn(Optional.of(etudiant));
        Optional<Etudiant> result = etudiantService.getEtudiantById(1L);
        assertTrue(result.isPresent());
        assertEquals("Rakoto", result.get().getNom());
    }

    @Test
    void testGetEtudiantById_notFound() {
        when(etudiantRepository.findById(2L)).thenReturn(Optional.empty());
        Optional<Etudiant> result = etudiantService.getEtudiantById(2L);
        assertFalse(result.isPresent());
    }

    @Test
    void testCreateEtudiant() {
        when(etudiantRepository.save(etudiant)).thenReturn(etudiant);
        Etudiant result = etudiantService.createEtudiant(etudiant);
        assertNotNull(result);
        assertEquals("jean.rakoto@mail.com", result.getEmail());
    }

    @Test
    void testDeleteEtudiant() {
        etudiantService.deleteEtudiant(1L);
        verify(etudiantRepository, times(1)).deleteById(1L);
    }
}