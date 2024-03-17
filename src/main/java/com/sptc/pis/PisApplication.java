package com.sptc.pis;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.sptc.pis.jwt.models.ERole;
import com.sptc.pis.jwt.models.Role;
import com.sptc.pis.jwt.models.User;
import com.sptc.pis.jwt.request.SignupRequest;

import com.sptc.pis.jwt.AuthController;
import lombok.extern.slf4j.Slf4j;

import com.sptc.pis.jwt.repository.RoleRepository;
import com.sptc.pis.jwt.repository.UserRepository;

@SpringBootApplication
@Slf4j
public class PisApplication implements CommandLineRunner {

	
	@Value("${username.for.login}")
	private String username;

	@Value("${email.for.login}")
	private String email;

	@Value("${password.for.login}")
	private String password;

	@Value("${user.role}")
	private Set<String> userRoles;
	
	@Autowired
	public RoleRepository roleRepository;

	@Autowired
	public UserRepository userRepository;
	
	@Autowired
	private AuthController authController;

	
	public static void main(String[] args) {
		SpringApplication.run(PisApplication.class, args);
	}

	
	@Override
	public void run(String... args) throws Exception {
	
	// Initialize Role
	List<Role> roles = roleRepository.findAll();
	// logger.info("#  Roles are {} ", roles);
	if (roles.size() == 0) {
		log.info("# No Roles found, Initializing Roles");

		Role role = new Role(1, ERole.ROLE_HOSPITAL_USER);
		roleRepository.save(role);

		role = new Role(2, ERole.ROLE_ADMIN);
		roleRepository.save(role);
	}

	// Initialize user
	List<User> user = userRepository.findAll();
	// logger.info("#  Users are {} ", user);
	if (user.isEmpty()) {
		log.info("# No users found,Initializing USER");
		try {
			SignupRequest signupRequest = new SignupRequest();
			signupRequest.setUsername(username);
			signupRequest.setPassword(password);
			signupRequest.setEmail(email);
			signupRequest.setRole(userRoles);
			authController.InitialregisterUser(signupRequest);
		} catch (Exception e) {
			log.info("# ERROR in signup {} ");
			e.printStackTrace();
		}
	}
	}

}
